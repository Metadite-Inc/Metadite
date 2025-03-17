import React from 'react';
import LoginForm from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = ({ email, password }) => {
    // For now, simulate login with a dummy check.
    console.log('Logging in with', email, password);
    // Redirect to dashboard after a successful login simulation.
    navigate('/dashboard');
  };

  return (
    <div>
      <LoginForm onSubmit={handleLogin} title="User Login" />
      <div>
        <p>Or login using social media:</p>
        <button onClick={() => alert('Google Login (to be implemented)')}>Google</button>
        <button onClick={() => alert('Facebook Login (to be implemented)')}>Facebook</button>
        <button onClick={() => alert('Twitter Login (to be implemented)')}>Twitter</button>
      </div>
    </div>
  );
};

export default Login;
