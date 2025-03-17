import React from 'react';
import LoginForm from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = ({ email, password }) => {
    console.log('Logging in with', email, password);
    // Simulate login and navigate to dashboard.
    navigate('/dashboard');
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      //backgroundColor: '#f0f0f0'
    }}>
      <div style={{
        backgroundColor: 'pink',
        padding: '30px',
        borderRadius: '8px',
        border: '2px solid black',
        textAlign: 'center',
        width: '400px'
      }}>
        <LoginForm onSubmit={handleLogin} title="User Login" />
        <div style={{ marginTop: '20px' }}>
          <p style={{ color: 'black' }}>Or login using social media:</p>
          <button 
            style={{ margin: '5px', padding: '8px 16px', fontSize: '14px' }}
            onClick={() => alert('Google Login (to be implemented)')}
          >
            Login with Google
          </button>
          <button 
            style={{ margin: '5px', padding: '8px 16px', fontSize: '14px' }}
            onClick={() => alert('Facebook Login (to be implemented)')}
          >
            Login with Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
