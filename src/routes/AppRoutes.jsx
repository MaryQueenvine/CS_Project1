// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Auth Pages
import LoginPage from '../components/LoginPage';
import RegisterPage from '../components/RegisterPage';

// Student Module
import StudentDashboard from '../components/StudentDashboard';
import TriageChatbotPage from '../pages/TriageChatbotPage';
import MoodCheckInPage from '../pages/MoodCheckInPage';
import MoodHistoryPage from '../pages/MoodHistoryPage';
import StudentResourcesPage from '../pages/StudentResourcesPage';
import SessionRequestPage from '../pages/SessionRequestPage';
import SessionRequestListPage from '../pages/SessionRequestListPage';
import TriageSummaryListPage from '../pages/TriageSummaryListPage';
import StudentProfilePage from '../pages/StudentProfilePage';
import AssignedTherapistPage from '../pages/AssignedTherapistPage';
import ConfirmedSessionsPage from '../pages/ConfirmedSessionsPage';
import NotificationsPage from '../pages/NotificationsPage';
import ChatTherapistPage from '../pages/ChatTherapistPage';

// Therapist Module
import TherapistDashboard from '../components/TherapistDashboard';
import TriageSummaryReviewPage from '../pages/TriageSummaryReviewPage';
import AssignedStudentsPage from '../pages/AssignedStudentsPage';
import ViewStudentMoodLogsPage from '../pages/ViewStudentMoodLogsPage';
import GlobalFlaggedMoodLogsPage from '../pages/GlobalFlaggedMoodLogsPage';
import TherapistSessionRequestsPage from '../pages/TherapistSessionRequestsPage';
import TherapistChatPage from '../pages/TherapistChatPage';
import TherapistProfilePage from '../pages/TherapistProfilePage';

// Admin Module
import AdminDashboard from '../components/AdminDashboard';
import AssignTherapistPage from '../pages/AssignTherapistPage';
import EmergencyAlertReviewPage from '../pages/EmergencyAlertReviewPage';
import AdminResourcesPage from '../pages/AdminResourcesPage';
import AdminProfilePage from '../pages/AdminProfilePage';
import AdminStudentsPage from '../pages/AdminStudentsPage';
import AdminTherapistsPage from '../pages/AdminTherapistsPage';
import AdminSessionRequestsPage from '../pages/AdminSessionRequestsPage';

const AppRoutes = () => (
  <Routes>
    {/* Auth */}
    <Route path="/" element={<Navigate to="/login" />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    {/* Student Module */}
    <Route path="/dashboard-student" element={<StudentDashboard />} />
    <Route path="/triage-chatbot" element={<TriageChatbotPage />} />
    <Route path="/mood-checkin" element={<MoodCheckInPage />} />
    <Route path="/mood-history" element={<MoodHistoryPage />} />
    <Route path="/student-resources" element={<StudentResourcesPage />} />
    <Route path="/request-session" element={<SessionRequestPage />} />
    <Route path="/session-requests" element={<SessionRequestListPage />} />
    <Route path="/triage-summaries" element={<TriageSummaryListPage />} />
    <Route path="/student-profile" element={<StudentProfilePage />} />
    <Route path="/assigned-therapist" element={<AssignedTherapistPage />} />
    <Route path="/confirmed-sessions" element={<ConfirmedSessionsPage />} />
    <Route path="/notifications" element={<NotificationsPage />} />
    <Route path="/chat-therapist" element={<ChatTherapistPage />} />

    {/* Therapist Module */}
    <Route path="/dashboard-therapist" element={<TherapistDashboard />} />
    <Route path="/triage-reviews" element={<TriageSummaryReviewPage />} />
    <Route path="/assigned-students" element={<AssignedStudentsPage />} />
    <Route path="/student-mood-logs/:email" element={<ViewStudentMoodLogsPage />} />
    <Route path="/therapist-session-requests" element={<TherapistSessionRequestsPage />} />
    <Route path="/chat-student" element={<TherapistChatPage />} />
    <Route path="/therapist-profile" element={<TherapistProfilePage />} />

    {/* Admin Module */}
    <Route path="/dashboard-admin" element={<AdminDashboard />} />
    <Route path="/assign-therapist" element={<AssignTherapistPage />} />
    <Route path="/admin-resources" element={<AdminResourcesPage />} />
    <Route path="/admin-profile" element={<AdminProfilePage />} />
    <Route path="/admin-students" element={<AdminStudentsPage />} />
    <Route path="/admin-therapists" element={<AdminTherapistsPage />} />
    <Route path="/admin-session-requests" element={<AdminSessionRequestsPage />} />
    <Route path="/admin-alerts" element={<EmergencyAlertReviewPage />} />
    <Route path="/admin-flagged-logs" element={<GlobalFlaggedMoodLogsPage />} />

    {/* Shared */}
    <Route path="/global-flagged-mood-logs" element={<GlobalFlaggedMoodLogsPage />} />

    {/* 404 fallback */}
    <Route path="*" element={<h2>404 - Page Not Found</h2>} />
  </Routes>
);

export default AppRoutes;
