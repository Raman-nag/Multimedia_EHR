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
      <Route path="/patient/dashboard" element={<PatientDashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
