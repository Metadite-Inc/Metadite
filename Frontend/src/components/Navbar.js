// src/components/Navbar.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <nav style={{
      backgroundColor: theme === 'light' ? '#333' : '#555',
      padding: '10px',
      display: 'flex',
      alignItems: 'center'
    }}>
      <Link to="/" style={{ color: '#fff', marginRight: '10px' }}>Home</Link>
      <Link to="/login" style={{ color: '#fff', marginRight: '10px' }}>Login</Link>
      <Link to="/dashboard" style={{ color: '#fff', marginRight: '10px' }}>Dashboard</Link>
      <Link to="/moderator/login" style={{ color: '#fff', marginRight: '10px' }}>Moderator</Link>
      <Link to="/admin" style={{ color: '#fff', marginRight: '10px' }}>Admin Panel</Link>
      
      <button 
        onClick={toggleTheme} 
        style={{
          marginLeft: 'auto',
          padding: '5px 10px',
          fontSize: '14px',
          cursor: 'pointer'
        }}
      >
        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
      </button>
    </nav>
  );
};

export default Navbar;
