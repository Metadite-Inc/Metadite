import React, { useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';

const LoginForm = ({ onSubmit, title }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  const inputContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '8px',
    backgroundColor: '#fff',
    marginBottom: '15px'
  };

  const iconStyle = {
    marginRight: '8px',
    color: '#999'
  };

  const inputStyle = {
    border: 'none',
    outline: 'none',
    flex: 1,
    fontSize: '16px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold'
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>{title}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label style={labelStyle}>Email:</label>
          <div style={inputContainerStyle}>
            <FaEnvelope style={iconStyle} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              style={inputStyle}
            />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Password:</label>
          <div style={inputContainerStyle}>
            <FaLock style={iconStyle} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              style={inputStyle}
            />
          </div>
        </div>
        <button 
          type="submit" 
          style={{ marginTop: '10px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
