const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EMRSystem", function () {
  let EMRSystem, HospitalManagement, DoctorManagement, PatientManagement, AccessControl;
  let emrSystem, hospitalManagement, doctorManagement, patientManagement, accessControl;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

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
    patientManagement = await PatientManagement.deploy(doctorManagement.address, accessControl.address);
    await patientManagement.deployed();

    // Deploy HospitalManagement
    HospitalManagement = await ethers.getContractFactory("HospitalManagement");
    hospitalManagement = await HospitalManagement.deploy(
      doctorManagement.address,
      patientManagement.address,
      accessControl.address
    );
    await hospitalManagement.deployed();

    // Deploy EMRSystem
    EMRSystem = await ethers.getContractFactory("EMRSystem");
    emrSystem = await EMRSystem.deploy(
      hospitalManagement.address,
      doctorManagement.address,
      patientManagement.address
    );
    await emrSystem.deployed();
  });

  describe("Initialization", function () {
    it("Should set the right owner", async function () {
      expect(await emrSystem.owner()).to.equal(owner.address);
    });

    it("Should have correct contract addresses", async function () {
      const addresses = await emrSystem.getContractAddresses();
      expect(addresses.hospital).to.equal(hospitalManagement.address);
      expect(addresses.doctor).to.equal(doctorManagement.address);
      expect(addresses.patient).to.equal(patientManagement.address);
    });
  });

  describe("System Control", function () {
    it("Should allow owner to pause system", async function () {
      await emrSystem.pauseSystem();
      expect(await emrSystem.systemPaused()).to.equal(true);
    });

    it("Should allow owner to resume system", async function () {
      await emrSystem.pauseSystem();
      await emrSystem.resumeSystem();
      expect(await emrSystem.systemPaused()).to.equal(false);
    });

    it("Should not allow non-owner to pause system", async function () {
      await expect(
        emrSystem.connect(addr1).pauseSystem()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Contract Upgrades", function () {
    it("Should allow owner to upgrade contract addresses", async function () {
      const newAddress = addr1.address;
      await emrSystem.upgradeContract("hospital", newAddress);
      const addresses = await emrSystem.getContractAddresses();
      expect(addresses.hospital).to.equal(newAddress);
    });

    it("Should not allow invalid contract names", async function () {
      await expect(
        emrSystem.upgradeContract("invalid", addr1.address)
      ).to.be.revertedWith("Invalid contract name");
    });

    it("Should not allow zero addresses", async function () {
      await expect(
        emrSystem.upgradeContract("hospital", ethers.constants.AddressZero)
      ).to.be.revertedWith("Invalid address");
    });
  });
});
