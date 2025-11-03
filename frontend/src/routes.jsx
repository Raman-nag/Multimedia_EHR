// src/routes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HospitalDashboard from "./pages/HospitalDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import NotFound from "./pages/NotFound";
import AddDoctorPage from "./pages/hospital/AddDoctorPage";
import PatientsPage from "./pages/hospital/PatientsPage";
import AnalyticsPage from "./pages/hospital/AnalyticsPage";
import CreateRecord from "./components/doctor/CreateRecord";
import MyPatients from "./components/doctor/MyPatients";
import PrescriptionForm from "./components/doctor/PrescriptionForm";
import ViewPatientHistory from "./components/doctor/ViewPatientHistory";
import MedicalHistory from "./components/patient/MedicalHistory";
import Prescriptions from "./components/patient/Prescriptions";
import GrantAccess from "./components/patient/GrantAccess";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Hospital Routes */}
      <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
      <Route path="/hospital/add-doctor" element={<AddDoctorPage />} />
      <Route path="/hospital/patients" element={<PatientsPage />} />
      <Route path="/hospital/analytics" element={<AnalyticsPage />} />
      
      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
      {/* Doctor subpages */}
      <Route path="/doctor/create-record" element={<CreateRecord />} />
      <Route path="/doctor/my-patients" element={<MyPatients />} />
      <Route path="/doctor/write-prescription" element={<PrescriptionForm />} />
      <Route path="/doctor/patient-history/:patientId" element={<ViewPatientHistory />} />
      <Route path="/patient/dashboard" element={<PatientDashboard />} />
      {/* Patient subpages */}
      <Route path="/patient/medical-history" element={<MedicalHistory />} />
      <Route path="/patient/prescriptions" element={<Prescriptions />} />
      <Route path="/patient/manage-access" element={<GrantAccess />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
