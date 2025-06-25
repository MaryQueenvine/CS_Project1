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
import SessionRequestPage from '../pages/SessionRequestPage';
import SessionRequestListPage from '../pages/SessionRequestListPage';
import TriageSummaryListPage from '../pages/TriageSummaryListPage';
import TherapistAssignmentPage from '../pages/TherapistAssignmentPage';
import ConfirmedSessionsPage from '../pages/ConfirmedSessionsPage';
import StudentNotificationsPage from '../pages/StudentNotificationsPage';
import PreSessionChatPage from '../pages/PreSessionChatPage';
import StudentProfilePage from '../pages/StudentProfilePage';

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
    <Route path="/student-resources" element={<StudentResourcesPage />} />
    <Route path="/request-session" element={<SessionRequestPage />} />
    <Route path="/session-requests" element={<SessionRequestListPage />} />
    <Route path="/triage-summaries" element={<TriageSummaryListPage />} />
    <Route path="/assigned-therapist" element={<TherapistAssignmentPage />} />
    <Route path="/confirmed-sessions" element={<ConfirmedSessionsPage />} />
    <Route path="/notifications" element={<StudentNotificationsPage />} />
    <Route path="/chat-therapist" element={<PreSessionChatPage />} />
    <Route path="/student-profile" element={<StudentProfilePage />} />
    <Route path="*" element={<h2>404 - Page Not Found</h2>} />

  </Routes>
);

export default AppRoutes;
