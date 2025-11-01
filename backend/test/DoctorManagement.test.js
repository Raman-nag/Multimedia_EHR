const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DoctorManagement", function () {
  let DoctorManagement, AccessControl;
  let doctorManagement, accessControl;
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

    // Grant roles
    const HOSPITAL_ROLE = await accessControl.HOSPITAL_ROLE();
    const DOCTOR_ROLE = await accessControl.DOCTOR_ROLE();
    await accessControl.grantRole(HOSPITAL_ROLE, hospital.address);
    await accessControl.grantRole(DOCTOR_ROLE, doctor.address);
  });

  describe("Doctor Registration", function () {
    it("Should register a new doctor", async function () {
      await doctorManagement.connect(hospital).registerDoctor(
        doctor.address,
        "DOC123",
        hospital.address
      );

      const registeredDoctor = await doctorManagement.doctors(doctor.address);
      expect(registeredDoctor.licenseNumber).to.equal("DOC123");
      expect(registeredDoctor.hospitalAddress).to.equal(hospital.address);
      expect(registeredDoctor.isActive).to.be.true;
    });

    it("Should not allow non-hospital to register doctor", async function () {
      await expect(
        doctorManagement.connect(doctor).registerDoctor(
          doctor.address,
          "DOC123",
          hospital.address
        )
      ).to.be.revertedWith("Only hospital can perform this action");
    });
  });

  describe("Medical Records", function () {
    beforeEach(async function () {
      await doctorManagement.connect(hospital).registerDoctor(
        doctor.address,
        "DOC123",
        hospital.address
      );
    });

    it("Should create a medical record", async function () {
      const record = {
        diagnosis: "Fever",
        symptoms: ["High Temperature", "Headache"],
        prescription: "Paracetamol",
        treatmentPlan: "Rest and hydration",
        ipfsHash: "QmHash123"
      };

      await doctorManagement.connect(doctor).createMedicalRecord(
        patient.address,
        record.diagnosis,
        record.symptoms,
        record.prescription,
        record.treatmentPlan,
        record.ipfsHash
      );

      const records = await doctorManagement.getPatientRecords(patient.address);
      expect(records.length).to.equal(1);
    });

    it("Should update a medical record", async function () {
      // First create a record
      await doctorManagement.connect(doctor).createMedicalRecord(
        patient.address,
        "Initial Diagnosis",
        ["Symptom1"],
        "Initial Prescription",
        "Initial Plan",
        "QmHash123"
      );

      const records = await doctorManagement.getPatientRecords(patient.address);
      const recordId = records[0];

      // Update the record
      await doctorManagement.connect(doctor).updateMedicalRecord(
        recordId,
        "Updated Diagnosis",
        ["Updated Symptom"],
        "Updated Prescription",
        "Updated Plan",
        "QmHash124"
      );

      const updatedRecord = await doctorManagement.getRecordById(recordId);
      expect(updatedRecord.diagnosis).to.equal("Updated Diagnosis");
    });

    it("Should not allow unauthorized updates", async function () {
      await doctorManagement.connect(doctor).createMedicalRecord(
        patient.address,
        "Diagnosis",
        ["Symptom"],
        "Prescription",
        "Plan",
        "QmHash123"
      );

      const records = await doctorManagement.getPatientRecords(patient.address);
      const recordId = records[0];

      // Try to update with different doctor
      const [_, __, unauthorizedDoctor] = await ethers.getSigners();
      await expect(
        doctorManagement.connect(unauthorizedDoctor).updateMedicalRecord(
          recordId,
          "Updated",
          ["Updated"],
          "Updated",
          "Updated",
          "QmHash124"
        )
      ).to.be.revertedWith("Not an active doctor");
    });
  });

  describe("Patient Management", function () {
    beforeEach(async function () {
      await doctorManagement.connect(hospital).registerDoctor(
        doctor.address,
        "DOC123",
        hospital.address
      );
    });

    it("Should track doctor's patients", async function () {
      await doctorManagement.connect(doctor).createMedicalRecord(
        patient.address,
        "Diagnosis",
        ["Symptom"],
        "Prescription",
        "Plan",
        "QmHash123"
      );

      const patients = await doctorManagement.connect(doctor).getDoctorPatients();
      expect(patients).to.include(patient.address);
    });
  });

  describe("Doctor Deactivation", function () {
    beforeEach(async function () {
      await doctorManagement.connect(hospital).registerDoctor(
        doctor.address,
        "DOC123",
        hospital.address
      );
    });

    it("Should allow hospital to deactivate doctor", async function () {
      await doctorManagement.connect(hospital).deactivateDoctor(doctor.address);
      const doctorData = await doctorManagement.doctors(doctor.address);
      expect(doctorData.isActive).to.be.false;
    });
  });
});
