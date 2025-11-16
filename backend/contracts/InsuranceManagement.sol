// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IEMRSystem {
    function insuranceAdmins(address)
        external
        view
        returns (
            string memory name,
            string memory registrationNumber,
            address wallet,
            bool active,
            uint256 addedAt
        );
}

contract InsuranceManagement {
    IEMRSystem public emrSystem;

    /// @notice Status of a specific (patient, insurer) application
    enum Status {
        None,
        Pending,
        Granted,
        Rejected,
        Cancelled
    }

    /// @notice Insurance application for a (patient, insurer) pair
    struct Application {
        address patient;
        address insurer;   // insurance admin wallet the patient applied to
        address reviewer;  // insurance admin who took final action (usually same as insurer)
        Status status;
        uint256 requestedAt;
        uint256 decidedAt;
        string reason;     // optional rejection/cancellation/comment reason
    }

    /// @dev applications[patient][insurer]
    mapping(address => mapping(address => Application)) private applications;

    /// @dev For a patient, all insurers they have ever interacted with
    mapping(address => address[]) private patientInsurers;

    /// @dev For an insurer, all patients who have ever applied to them
    mapping(address => address[]) private insurerPatients;

    /// @dev Global counters for analytics
    uint256 public totalPending;
    uint256 public totalGranted;
    uint256 public totalRejected;
    uint256 public totalCancelled;

    event ApplicationRequested(
        address indexed patient,
        address indexed insurer,
        uint256 timestamp
    );

    event InsuranceGranted(
        address indexed patient,
        address indexed insurer,
        address indexed reviewer,
        uint256 timestamp
    );

    event InsuranceRejected(
        address indexed patient,
        address indexed insurer,
        address indexed reviewer,
        uint256 timestamp,
        string reason
    );

    event ApplicationCancelled(
        address indexed patient,
        address indexed insurer,
        uint256 timestamp,
        string reason
    );

    modifier onlyInsuranceAdmin() {
        (, , , bool active, ) = emrSystem.insuranceAdmins(msg.sender);
        require(active, "Not insurance admin");
        _;
    }

    constructor(address _emrSystem) {
        require(_emrSystem != address(0), "Invalid EMRSystem");
        emrSystem = IEMRSystem(_emrSystem);
    }

    // ==============================
    // Internal helpers
    // ==============================

    function _ensureInsuranceAdmin(address insurer) internal view {
        (, , address wallet, bool active, ) = emrSystem.insuranceAdmins(insurer);
        require(wallet != address(0) && active, "Invalid insurer");
    }

    function _maybeAddToList(address[] storage list, address value) internal {
        uint256 len = list.length;
        for (uint256 i = 0; i < len; i++) {
            if (list[i] == value) return;
        }
        list.push(value);
    }

    function _updateTotals(Status oldStatus, Status newStatus) internal {
        if (oldStatus == newStatus) return;

        if (oldStatus == Status.Pending) totalPending -= 1;
        else if (oldStatus == Status.Granted) totalGranted -= 1;
        else if (oldStatus == Status.Rejected) totalRejected -= 1;
        else if (oldStatus == Status.Cancelled) totalCancelled -= 1;

        if (newStatus == Status.Pending) totalPending += 1;
        else if (newStatus == Status.Granted) totalGranted += 1;
        else if (newStatus == Status.Rejected) totalRejected += 1;
        else if (newStatus == Status.Cancelled) totalCancelled += 1;
    }

    // ==============================
    // Patient-facing functions
    // ==============================

    /// @notice Patient applies for insurance with a specific insurer (admin wallet)
    function requestReview(address insurer) external {
        require(insurer != address(0), "Invalid insurer");
        _ensureInsuranceAdmin(insurer);

        Application storage ap = applications[msg.sender][insurer];
        require(
            ap.status == Status.None || ap.status == Status.Rejected || ap.status == Status.Cancelled,
            "Already pending or granted"
        );

        Status oldStatus = ap.status;
        ap.patient = msg.sender;
        ap.insurer = insurer;
        ap.reviewer = address(0);
        ap.status = Status.Pending;
        ap.requestedAt = block.timestamp;
        ap.decidedAt = 0;
        ap.reason = "";

        _maybeAddToList(patientInsurers[msg.sender], insurer);
        _maybeAddToList(insurerPatients[insurer], msg.sender);
        _updateTotals(oldStatus, Status.Pending);

        emit ApplicationRequested(msg.sender, insurer, block.timestamp);
    }

    /// @notice Patient cancels a pending application with an optional reason
    function cancelApplication(address insurer, string calldata reason) external {
        Application storage ap = applications[msg.sender][insurer];
        require(ap.patient == msg.sender, "No application");
        require(ap.status == Status.Pending, "Not pending");

        Status oldStatus = ap.status;
        ap.status = Status.Cancelled;
        ap.decidedAt = block.timestamp;
        ap.reason = reason;

        _updateTotals(oldStatus, Status.Cancelled);

        emit ApplicationCancelled(msg.sender, insurer, block.timestamp, reason);
    }

    // ==============================
    // Insurer-facing functions
    // ==============================

    /// @notice Approve a patient's application for the caller insurer
    function grantInsurance(address patient) external onlyInsuranceAdmin {
        require(patient != address(0), "Invalid patient");
        Application storage ap = applications[patient][msg.sender];
        require(ap.patient == patient && ap.insurer == msg.sender, "No application");
        require(ap.status == Status.Pending, "Not pending");

        Status oldStatus = ap.status;
        ap.status = Status.Granted;
        ap.reviewer = msg.sender;
        ap.decidedAt = block.timestamp;

        _updateTotals(oldStatus, Status.Granted);

        emit InsuranceGranted(patient, msg.sender, msg.sender, block.timestamp);
    }

    /// @notice Reject a patient's application for the caller insurer, with reason
    function rejectInsurance(address patient, string calldata reason) external onlyInsuranceAdmin {
        require(patient != address(0), "Invalid patient");
        Application storage ap = applications[patient][msg.sender];
        require(ap.patient == patient && ap.insurer == msg.sender, "No application");
        require(ap.status == Status.Pending, "Not pending");

        Status oldStatus = ap.status;
        ap.status = Status.Rejected;
        ap.reviewer = msg.sender;
        ap.decidedAt = block.timestamp;
        ap.reason = reason;

        _updateTotals(oldStatus, Status.Rejected);

        emit InsuranceRejected(patient, msg.sender, msg.sender, block.timestamp, reason);
    }

    /// @notice Update the reason/comment for an existing application (any status)
    function updateReason(address patient, string calldata reason) external onlyInsuranceAdmin {
        Application storage ap = applications[patient][msg.sender];
        require(ap.patient == patient && ap.insurer == msg.sender, "No application");
        ap.reason = reason;
    }

    // ==============================
    // Views / analytics
    // ==============================

    /// @notice Get a single application for (patient, insurer)
    function getApplication(address patient, address insurer) external view returns (Application memory) {
        return applications[patient][insurer];
    }

    /// @notice Get status for a (patient, insurer) pair
    function getStatus(address patient, address insurer) external view returns (Status) {
        return applications[patient][insurer].status;
    }

    /// @notice Get all applications for a given patient across insurers
    function getPatientApplications(address patient) external view returns (Application[] memory apps) {
        address[] storage insurers = patientInsurers[patient];
        uint256 len = insurers.length;
        apps = new Application[](len);
        for (uint256 i = 0; i < len; i++) {
            apps[i] = applications[patient][insurers[i]];
        }
    }

    /// @notice Get all applications for a given insurer; optionally filter by status (Status.None = no filter)
    function getInsurerApplications(address insurer, Status filterStatus) external view returns (Application[] memory apps) {
        address[] storage patients = insurerPatients[insurer];
        uint256 len = patients.length;
        uint256 count = 0;

        // First pass: count
        for (uint256 i = 0; i < len; i++) {
            Application storage ap = applications[patients[i]][insurer];
            if (filterStatus == Status.None || ap.status == filterStatus) {
                count++;
            }
        }

        apps = new Application[](count);
        uint256 idx = 0;
        for (uint256 i = 0; i < len; i++) {
            Application storage ap2 = applications[patients[i]][insurer];
            if (filterStatus == Status.None || ap2.status == filterStatus) {
                apps[idx] = ap2;
                idx++;
            }
        }
    }

    /// @notice Global totals for analytics
    function totals()
        external
        view
        returns (
            uint256 pending,
            uint256 granted,
            uint256 rejected,
            uint256 cancelled
        )
    {
        return (totalPending, totalGranted, totalRejected, totalCancelled);
    }
}
