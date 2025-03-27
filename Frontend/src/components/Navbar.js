import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav style={{ backgroundColor: '#333', padding: '10px' }}>
    <Link to="/" style={{ color: '#fff', marginRight: '10px' }}>Home</Link>
    <Link to="/login" style={{ color: '#fff', marginRight: '10px' }}>Login</Link>
    <Link to="/dashboard" style={{ color: '#fff', marginRight: '10px' }}>Dashboard</Link>
    <Link to="/moderator/login" style={{ color: '#fff', marginRight: '10px' }}>Moderator</Link>
    <Link to="/admin" style={{ color: '#fff', marginRight: '10px' }}>Admin Panel</Link>
  </nav>
);

export default Navbar;
