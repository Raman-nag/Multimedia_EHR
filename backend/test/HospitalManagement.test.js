const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HospitalManagement", function () {
  let HospitalManagement, DoctorManagement, PatientManagement, AccessControl;
  let hospitalManagement, doctorManagement, patientManagement, accessControl;
  let owner, hospital, doctor, patient;

  beforeEach(async function () {
    [owner, hospital, doctor, patient] = await ethers.getSigners();

    // Deploy AccessControl
    AccessControl = await ethers.getContractFactory("AccessControl");
    accessControl = await AccessControl.deploy();
    await accessControl.deployed();

    // Deploy DoctorManagement
    DoctorManagement = await ethers.getContractFactory("DoctorManagement");
    doctorManagement = await DoctorManagement.deploy(accessControl.address);
    await doctorManagement.deployed();

    // Deploy PatientManagement
    PatientManagement = await ethers.getContractFactory("PatientManagement");
    patientManagement = await PatientManagement.deploy(
      doctorManagement.address,
      accessControl.address
    );
    await patientManagement.deployed();

    // Deploy HospitalManagement
    HospitalManagement = await ethers.getContractFactory("HospitalManagement");
    hospitalManagement = await HospitalManagement.deploy(
      doctorManagement.address,
      patientManagement.address,
      accessControl.address
    );
    await hospitalManagement.deployed();

    // Grant hospital role
    const HOSPITAL_ROLE = await accessControl.HOSPITAL_ROLE();
    await accessControl.grantRole(HOSPITAL_ROLE, hospital.address);
  });

  describe("Hospital Registration", function () {
    it("Should register a new hospital", async function () {
      const hospitalData = {
        name: "City General Hospital",
        registrationNumber: "H123456"
      };

      await hospitalManagement.connect(hospital).registerHospital(
        hospitalData.name,
        hospitalData.registrationNumber
      );

      const registeredHospital = await hospitalManagement.hospitals(hospital.address);
      expect(registeredHospital.name).to.equal(hospitalData.name);
      expect(registeredHospital.registrationNumber).to.equal(hospitalData.registrationNumber);
      expect(registeredHospital.isActive).to.be.true;
    });

    it("Should not allow duplicate hospital registration", async function () {
      await hospitalManagement.connect(hospital).registerHospital(
        "City General Hospital",
        "H123456"
      );

      await expect(
        hospitalManagement.connect(hospital).registerHospital(
          "City General Hospital",
          "H123456"
        )
      ).to.be.revertedWith("Hospital already registered");
    });
  });

  describe("Doctor Management", function () {
    beforeEach(async function () {
      // Register hospital first
      await hospitalManagement.connect(hospital).registerHospital(
        "City General Hospital",
        "H123456"
      );
    });

    it("Should add a doctor", async function () {
      await hospitalManagement.connect(hospital).addDoctor(
        doctor.address,
        "DOC123"
      );

      const doctors = await hospitalManagement.getHospitalDoctors(hospital.address);
      expect(doctors).to.include(doctor.address);
    });

    it("Should remove a doctor", async function () {
      await hospitalManagement.connect(hospital).addDoctor(
        doctor.address,
        "DOC123"
      );
      await hospitalManagement.connect(hospital).removeDoctor(doctor.address);

      const doctors = await hospitalManagement.getHospitalDoctors(hospital.address);
      expect(doctors).to.not.include(doctor.address);
    });

    it("Should not allow non-hospital to add doctor", async function () {
      await expect(
        hospitalManagement.connect(doctor).addDoctor(
          doctor.address,
          "DOC123"
        )
      ).to.be.revertedWith("Not an active hospital");
    });
  });

  describe("Patient Management", function () {
    beforeEach(async function () {
      // Register hospital and add a doctor
      await hospitalManagement.connect(hospital).registerHospital(
        "City General Hospital",
        "H123456"
      );
      await hospitalManagement.connect(hospital).addDoctor(
        doctor.address,
        "DOC123"
      );
    });

    it("Should track hospital patients", async function () {
      const patients = await hospitalManagement.getHospitalPatients(hospital.address);
      expect(patients).to.be.an('array');
    });
  });

  describe("Hospital Deactivation", function () {
    beforeEach(async function () {
      await hospitalManagement.connect(hospital).registerHospital(
        "City General Hospital",
        "H123456"
      );
    });

    it("Should allow owner to deactivate hospital", async function () {
      await hospitalManagement.deactivateHospital(hospital.address);
      const hospitalData = await hospitalManagement.hospitals(hospital.address);
      expect(hospitalData.isActive).to.be.false;
    });

    it("Should not allow non-owner to deactivate hospital", async function () {
      await expect(
        hospitalManagement.connect(doctor).deactivateHospital(hospital.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
