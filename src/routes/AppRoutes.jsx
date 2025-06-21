// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../components/LoginPage';
import RegisterPage from '../components/RegisterPage';
import StudentDashboard from '../components/StudentDashboard';
import TherapistDashboard from '../components/TherapistDashboard';
import AdminDashboard from '../components/AdminDashboard';
import TriageChatbotPage from '../pages/TriageChatbotPage';
import MoodCheckInPage from '../pages/MoodCheckInPage';
import MoodHistoryPage from '../pages/MoodHistoryPage';
import StudentResourcesPage from '../pages/StudentResourcesPage';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/dashboard-student" element={<StudentDashboard />} />
    <Route path="/dashboard-therapist" element={<TherapistDashboard />} />
    <Route path="/dashboard-admin" element={<AdminDashboard />} />
    
    <Route path="/triage-chatbot" element={<TriageChatbotPage />} />
    <Route path="/mood-checkin" element={<MoodCheckInPage />} />
    <Route path="/mood-history" element={<MoodHistoryPage />} />
    <Route path="/resources-student" element={<StudentResourcesPage />} />
    <Route path="*" element={<h2>404 - Page Not Found</h2>} />

  </Routes>
);

export default AppRoutes;
