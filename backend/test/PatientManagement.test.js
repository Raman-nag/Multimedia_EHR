const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PatientManagement", function () {
  let PatientManagement, DoctorManagement, AccessControl;
  let patientManagement, doctorManagement, accessControl;
  let owner, doctor, patient, thirdParty;

  beforeEach(async function () {
    [owner, doctor, patient, thirdParty] = await ethers.getSigners();

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

    // Grant roles
    const PATIENT_ROLE = await accessControl.PATIENT_ROLE();
    await accessControl.grantRole(PATIENT_ROLE, patient.address);
  });

  describe("Patient Registration", function () {
    it("Should register a new patient", async function () {
      await patientManagement.connect(patient).registerPatient(
        "John Doe",
        "1990-01-01",
        "A+"
      );

      const registeredPatient = await patientManagement.patients(patient.address);
      expect(registeredPatient.name).to.equal("John Doe");
      expect(registeredPatient.dateOfBirth).to.equal("1990-01-01");
      expect(registeredPatient.bloodGroup).to.equal("A+");
      expect(registeredPatient.isActive).to.be.true;
    });

    it("Should not allow duplicate registration", async function () {
      await patientManagement.connect(patient).registerPatient(
        "John Doe",
        "1990-01-01",
        "A+"
      );

      await expect(
        patientManagement.connect(patient).registerPatient(
          "John Doe",
          "1990-01-01",
          "A+"
        )
      ).to.be.revertedWith("Patient already registered");
    });
  });

  describe("Access Control", function () {
    beforeEach(async function () {
      await patientManagement.connect(patient).registerPatient(
        "John Doe",
        "1990-01-01",
        "A+"
      );
    });

    it("Should grant access to third party", async function () {
      await patientManagement.connect(patient).grantAccess(thirdParty.address);
      const hasAccess = await patientManagement.hasAccess(thirdParty.address, patient.address);
      expect(hasAccess).to.be.true;
    });

    it("Should revoke access from third party", async function () {
      await patientManagement.connect(patient).grantAccess(thirdParty.address);
      await patientManagement.connect(patient).revokeAccess(thirdParty.address);
      const hasAccess = await patientManagement.hasAccess(thirdParty.address, patient.address);
      expect(hasAccess).to.be.false;
    });

    it("Should not allow unauthorized access to patient details", async function () {
      await expect(
        patientManagement.connect(thirdParty).getPatientDetails(patient.address)
      ).to.be.revertedWith("No access permission");
    });
  });

  describe("Medical Records Access", function () {
    beforeEach(async function () {
      await patientManagement.connect(patient).registerPatient(
        "John Doe",
        "1990-01-01",
        "A+"
      );
    });

    it("Should allow patient to access their own records", async function () {
      const records = await patientManagement.connect(patient).getMyRecords();
      expect(records).to.be.an('array');
    });
  });

  describe("Patient Account Management", function () {
    beforeEach(async function () {
      await patientManagement.connect(patient).registerPatient(
        "John Doe",
        "1990-01-01",
        "A+"
      );
    });

    it("Should allow patient to deactivate their account", async function () {
      await patientManagement.connect(patient).deactivatePatient();
      const patientData = await patientManagement.patients(patient.address);
      expect(patientData.isActive).to.be.false;
    });

    it("Should not allow deactivated patient to grant access", async function () {
      await patientManagement.connect(patient).deactivatePatient();
      await expect(
        patientManagement.connect(patient).grantAccess(thirdParty.address)
      ).to.be.revertedWith("Not an active patient");
    });
  });
});
