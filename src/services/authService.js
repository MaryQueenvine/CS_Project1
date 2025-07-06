// src/services/authService.js

export const login = (email, password) => {
  const mockUsers = {
    'student@example.com': {
      role: 'Student',
      token: 'student-token',
      email: 'student@example.com'
    },
    'therapist@example.com': {
      role: 'Therapist',
      token: 'therapist-token',
      email: 'therapist@example.com'
    },
    'admin@example.com': {
      role: 'Admin',
      token: 'admin-token',
      email: 'admin@example.com'
    }
  };

  const user = mockUsers[email];
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));

    // DEV-ONLY: Initialize mock data for testing
    if (email === 'therapist@example.com') {
      initializeTherapistMockData(user.email);
    }

    if (email === 'student@example.com') {
      initializeStudentMockData(user.email);
    }

    return user;
  } else {
    return null;
  }
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem('user');
};

// 🔧 Development Mock Data for Therapist
function initializeTherapistMockData(therapistEmail) {
  const demoRequests = [
    {
      id: 'req-001',
      topic: 'Exam anxiety',
      urgency: 'High',
      preferredTime: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      studentId: 'student1@example.com',
      therapistEmail,
      status: 'pending'
    },
    {
      id: 'req-002',
      topic: 'Burnout',
      urgency: 'Medium',
      preferredTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      submittedAt: new Date().toISOString(),
      studentId: 'student2@example.com',
      therapistEmail,
      status: 'pending'
    }
  ];

  const demoAssignments = [
    { studentEmail: 'student1@example.com', therapistEmail },
    { studentEmail: 'student2@example.com', therapistEmail }
  ];

  if (!localStorage.getItem('sessionRequests')) {
    localStorage.setItem('sessionRequests', JSON.stringify(demoRequests));
  }

  if (!localStorage.getItem('studentAssignments')) {
    localStorage.setItem('studentAssignments', JSON.stringify(demoAssignments));
  }
}

// 🔧 Optional: Mock student-specific data
function initializeStudentMockData(studentEmail) {
  const existing = JSON.parse(localStorage.getItem('sessionRequests')) || [];
  const hasExisting = existing.some(req => req.studentId === studentEmail);

  if (!hasExisting) {
    const newReq = {
      id: `req-${Date.now()}`,
      topic: 'Time management stress',
      urgency: 'Low',
      preferredTime: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      studentId: studentEmail,
      therapistEmail: 'therapist@example.com',
      status: 'pending'
    };

    localStorage.setItem('sessionRequests', JSON.stringify([...existing, newReq]));
  }
}
