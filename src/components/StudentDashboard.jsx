import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, Button, Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Header from '../pages/Header'; // ensure Header is imported correctly

import '../pages/Landingpage.css'; // Ensure this path is correct

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  useEffect(() => {
    // Animate on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleEmergencyClick = () => setOpenConfirm(true);

  const handleSendAlert = () => {
    setOpenConfirm(false);
    setAlertSent(true);
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const newAlert = {
      studentId: currentUser?.email || 'anonymous@student.com',
      timestamp: new Date().toISOString(),
      reason: 'Triggered from Emergency Button',
      reviewed: false
    };
    const existingAlerts = JSON.parse(localStorage.getItem('emergencyAlerts')) || [];
    existingAlerts.push(newAlert);
    localStorage.setItem('emergencyAlerts', JSON.stringify(existingAlerts));
  };

  return (
    <>
      <Header />

      <section className="hero" style={{ paddingTop: '140px' }}>
        <div className="container">
          <div className="section-title animate-on-scroll">
            <h2>Welcome to Student MindCare</h2>
            <p>Your personalized dashboard for mental wellness support</p>
          </div>

          <div className="features-grid">
            {/* Triage Chatbot */}
            <div className="feature-card animate-on-scroll">
              <h3>🤖 Triage Chatbot</h3>
              <p>Begin your mental health check-in through a guided chatbot.</p>
              <Button className="btn btn-primary" fullWidth onClick={() => navigate('/triage-chatbot')}>
                Start Triage
              </Button>
              <Button className="btn btn-secondary" fullWidth onClick={() => navigate('/triage-summaries')}>
                View Past Triage Summaries
              </Button>
            </div>

            {/* Mood Check-in */}
            <div className="feature-card animate-on-scroll">
              <h3>🧠 Mood Check-In</h3>
              <p>Optional daily mood reflection to track emotional trends.</p>
              <Button className="btn btn-secondary" fullWidth onClick={() => navigate('/mood-checkin')}>
                Check In
              </Button>
            </div>

            {/* Session Request */}
            <div className="feature-card animate-on-scroll">
              <h3>📅 Request a Session</h3>
              <p>Choose a time to speak with your assigned therapist.</p>
              <Button className="btn btn-primary" fullWidth onClick={() => navigate('/request-session')}>
                Request Session
              </Button>
              <Button className="btn btn-secondary" fullWidth onClick={() => navigate('/assigned-therapist')}>
                View Assigned Therapist
              </Button>
              <Button className="btn btn-secondary" fullWidth onClick={() => navigate('/confirmed-sessions')}>
                View Confirmed Sessions
              </Button>
            </div>

            {/* Resources */}
            <div className="feature-card animate-on-scroll">
              <h3>📚 Resources</h3>
              <p>Access therapist-curated content to help you cope and grow.</p>
              <Button className="btn btn-secondary" fullWidth onClick={() => navigate('/student-resources')}>
                View Materials
              </Button>
            </div>

            {/* Notifications */}
            <div className="feature-card animate-on-scroll">
              <h3>🔔 Notifications</h3>
              <p>Access your notifications for important updates and messages.</p>
              <Button className="btn btn-primary" fullWidth onClick={() => navigate('/notifications')}>
                View Notifications
              </Button>
            </div>

            {/* Pre-Session Chat */}
            <div className="feature-card animate-on-scroll">
              <h3>💬 Chat with Therapist</h3>
              <p>Chat with your therapist before your session to discuss any concerns or topics.</p>
              <Button className="btn btn-primary" fullWidth onClick={() => navigate('/chat-therapist')}>
                Message My Therapist
              </Button>
            </div>

            {/* Emergency */}
            <div className="feature-card animate-on-scroll" style={{ backgroundColor: '#ffeaea' }}>
              <h3>🚨 Emergency Support</h3>
              <p>If you are in distress or need urgent help, click below.</p>
              <Button className="btn btn-primary" style={{ backgroundColor: '#e53935' }} fullWidth onClick={handleEmergencyClick}>
                Alert Admin & Therapist
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Confirmation Dialog */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Emergency Alert</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to send an emergency alert? Your assigned therapist and system admin will be notified immediately.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button onClick={handleSendAlert} color="error" variant="contained">
            Yes, Send Alert
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Snackbar */}
      <Snackbar open={alertSent} autoHideDuration={5000} onClose={() => setAlertSent(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>
          Emergency alert sent! Help is on the way.
        </Alert>
      </Snackbar>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p style={{ color: '#ccc', textAlign: 'center' }}>
            &copy; 2025 Student MindCare. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default StudentDashboard;
