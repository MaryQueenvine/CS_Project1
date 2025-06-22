// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../components/LoginPage';
import RegisterPage from '../components/RegisterPage';
import StudentDashboard from '../components/StudentDashboard';
import TherapistDashboard from '../components/TherapistDashboard';
import AdminDashboard from '../components/AdminDashboard';
import TriageChatbotPage from '../pages/TriageChatbotPage';
import Landingpage from "../pages/Landingpage";


const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Landingpage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/dashboard-student" element={<StudentDashboard />} />
    <Route path="/dashboard-therapist" element={<TherapistDashboard />} />
    <Route path="/dashboard-admin" element={<AdminDashboard />} />
    <Route path="*" element={<h2>404 - Page Not Found</h2>} />
    <Route path="/triage-chatbot" element={<TriageChatbotPage />} />

  </Routes>
);

export default AppRoutes;
