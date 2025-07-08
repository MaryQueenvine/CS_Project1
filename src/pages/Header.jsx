import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header style={{ background: 'rgba(255,255,255,0.95)', padding: '1rem 0' }}>
      <nav className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="logo">Student MindCare</div>
        <div>
          {user ? (
            <>
              <span style={{ marginRight: '1rem', fontWeight: 'bold' }}>
                Welcome, {user.firstName || user.username}
              </span>
              <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary" style={{ marginRight: '1rem' }}>Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
