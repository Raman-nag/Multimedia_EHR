// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./HospitalManagement.sol";
import "./DoctorManagement.sol";
import "./PatientManagement.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title EMRSystem
 * @dev Main contract for Electronic Medical Records System
 */
contract EMRSystem is Ownable, ReentrancyGuard {
    HospitalManagement public hospitalManagement;
    DoctorManagement public doctorManagement;
    PatientManagement public patientManagement;

    // System state
    bool public systemPaused;

    // Events
    event SystemPaused(address indexed admin);
    event SystemResumed(address indexed admin);
    event ContractUpgraded(string contractName, address newAddress);

    // ===============================
    // Admin-managed entity registries
    // ===============================
    struct AdminProfile {
        string name;
        string registrationNumber;
        address wallet;
        bool active;
        uint256 addedAt;
    }

    // Hospital admins
    mapping(address => AdminProfile) public hospitalAdmins;
    address[] public hospitalAdminList;
    event HospitalAdminAdded(address indexed wallet, string name, string registrationNumber);
    event HospitalAdminUpdated(address indexed wallet, string name, string registrationNumber, bool active);
    event HospitalAdminRemoved(address indexed wallet);

    // Insurance admins
    mapping(address => AdminProfile) public insuranceAdmins;
    address[] public insuranceAdminList;
    event InsuranceAdminAdded(address indexed wallet, string name, string registrationNumber);
    event InsuranceAdminUpdated(address indexed wallet, string name, string registrationNumber, bool active);
    event InsuranceAdminRemoved(address indexed wallet);

    // Research admins
    mapping(address => AdminProfile) public researchAdmins;
    address[] public researchAdminList;
    event ResearchAdminAdded(address indexed wallet, string name, string registrationNumber);
    event ResearchAdminUpdated(address indexed wallet, string name, string registrationNumber, bool active);
    event ResearchAdminRemoved(address indexed wallet);

    /**
     * @dev Modifier to check if system is not paused
     */
    modifier whenNotPaused() {
        require(!systemPaused, "System is paused");
        _;
    }

    /**
     * @dev Constructor to initialize sub-contracts
     */
    constructor(
        address _hospitalManagement,
        address _doctorManagement,
        address _patientManagement
    ) {
        hospitalManagement = HospitalManagement(_hospitalManagement);
        doctorManagement = DoctorManagement(_doctorManagement);
        patientManagement = PatientManagement(_patientManagement);
    }

    /**
     * @dev Emergency pause function
     */
    function pauseSystem() external onlyOwner {
        systemPaused = true;
        emit SystemPaused(msg.sender);
    }

    /**
     * @dev Resume system operations
     */
    function resumeSystem() external onlyOwner {
        systemPaused = false;
        emit SystemResumed(msg.sender);
    }

    /**
     * @dev Upgrade contract addresses
     */
    function upgradeContract(string memory contractName, address newAddress) external onlyOwner {
        require(newAddress != address(0), "Invalid address");

        if (keccak256(bytes(contractName)) == keccak256(bytes("hospital"))) {
            hospitalManagement = HospitalManagement(newAddress);
        } else if (keccak256(bytes(contractName)) == keccak256(bytes("doctor"))) {
            doctorManagement = DoctorManagement(newAddress);
        } else if (keccak256(bytes(contractName)) == keccak256(bytes("patient"))) {
            patientManagement = PatientManagement(newAddress);
        } else {
            revert("Invalid contract name");
        }

        emit ContractUpgraded(contractName, newAddress);
    }

    /**
     * @dev Get contract addresses
     */
    function getContractAddresses() external view returns (
        address hospital,
        address doctor,
        address patient
    ) {
        return (
            address(hospitalManagement),
            address(doctorManagement),
            address(patientManagement)
        );
    }

    // ===============================
    // Admin-only management (single owner model)
    // ===============================
    function addHospitalAdmin(address wallet, string memory name, string memory registrationNumber) external onlyOwner {
        require(wallet != address(0), "Invalid wallet");
        require(!hospitalAdmins[wallet].active, "Already exists");
        hospitalAdmins[wallet] = AdminProfile({
            name: name,
            registrationNumber: registrationNumber,
            wallet: wallet,
            active: true,
            addedAt: block.timestamp
        });
        hospitalAdminList.push(wallet);
        emit HospitalAdminAdded(wallet, name, registrationNumber);
    }

    function updateHospitalAdmin(address wallet, string memory name, string memory registrationNumber, bool active) external onlyOwner {
        require(wallet != address(0), "Invalid wallet");
        require(hospitalAdmins[wallet].wallet != address(0), "Not found");
        AdminProfile storage p = hospitalAdmins[wallet];
        p.name = name;
        p.registrationNumber = registrationNumber;
        p.active = active;
        emit HospitalAdminUpdated(wallet, name, registrationNumber, active);
    }

    function removeHospitalAdmin(address wallet) external onlyOwner {
        require(hospitalAdmins[wallet].wallet != address(0), "Not found");
        hospitalAdmins[wallet].active = false;
        emit HospitalAdminRemoved(wallet);
    }

    function getHospitalAdminList() external view returns (address[] memory) {
        return hospitalAdminList;
    }

    function addInsuranceAdmin(address wallet, string memory name, string memory registrationNumber) external onlyOwner {
        require(wallet != address(0), "Invalid wallet");
        require(!insuranceAdmins[wallet].active, "Already exists");
        insuranceAdmins[wallet] = AdminProfile({
            name: name,
            registrationNumber: registrationNumber,
            wallet: wallet,
            active: true,
            addedAt: block.timestamp
        });
        insuranceAdminList.push(wallet);
        emit InsuranceAdminAdded(wallet, name, registrationNumber);
    }

    function updateInsuranceAdmin(address wallet, string memory name, string memory registrationNumber, bool active) external onlyOwner {
        require(wallet != address(0), "Invalid wallet");
        require(insuranceAdmins[wallet].wallet != address(0), "Not found");
        AdminProfile storage p = insuranceAdmins[wallet];
        p.name = name;
        p.registrationNumber = registrationNumber;
        p.active = active;
        emit InsuranceAdminUpdated(wallet, name, registrationNumber, active);
    }

    function removeInsuranceAdmin(address wallet) external onlyOwner {
        require(insuranceAdmins[wallet].wallet != address(0), "Not found");
        insuranceAdmins[wallet].active = false;
        emit InsuranceAdminRemoved(wallet);
    }

    function getInsuranceAdminList() external view returns (address[] memory) {
        return insuranceAdminList;
    }

    function addResearchAdmin(address wallet, string memory name, string memory registrationNumber) external onlyOwner {
        require(wallet != address(0), "Invalid wallet");
        require(!researchAdmins[wallet].active, "Already exists");
        researchAdmins[wallet] = AdminProfile({
            name: name,
            registrationNumber: registrationNumber,
            wallet: wallet,
            active: true,
            addedAt: block.timestamp
        });
        researchAdminList.push(wallet);
        emit ResearchAdminAdded(wallet, name, registrationNumber);
    }

    function updateResearchAdmin(address wallet, string memory name, string memory registrationNumber, bool active) external onlyOwner {
        require(wallet != address(0), "Invalid wallet");
        require(researchAdmins[wallet].wallet != address(0), "Not found");
        AdminProfile storage p = researchAdmins[wallet];
        p.name = name;
        p.registrationNumber = registrationNumber;
        p.active = active;
        emit ResearchAdminUpdated(wallet, name, registrationNumber, active);
    }

    function removeResearchAdmin(address wallet) external onlyOwner {
        require(researchAdmins[wallet].wallet != address(0), "Not found");
        researchAdmins[wallet].active = false;
        emit ResearchAdminRemoved(wallet);
    }

    function getResearchAdminList() external view returns (address[] memory) {
        return researchAdminList;
    }
}
