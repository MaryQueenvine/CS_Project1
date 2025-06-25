// src/services/authService.js

export const login = (email, password) => {
  const mockUsers = {
    'student@example.com': {
      role: 'Student',
      token: 'student-token',
      email: 'student@example.com' // ✅ added for tracking session ownership
    },
    'therapist@example.com': {
      role: 'Therapist',
      token: 'therapist-token',
      email: 'therapist@example.com' // ✅ included to support therapist logic later
    },
    'admin@example.com': {
      role: 'Admin',
      token: 'admin-token',
      email: 'admin@example.com' // ✅ same here
    }
  };

  const user = mockUsers[email];
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
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
