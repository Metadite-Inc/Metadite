import React from 'react';
import LoginForm from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';

const ModeratorLogin = () => {
  const navigate = useNavigate();

  const handleModeratorLogin = ({ email, password }) => {
    // Validate moderator email format: firstname.moderator@metadite.com
    const regex = /^[a-zA-Z]+\.moderator@metadite\.com$/;
    if (!regex.test(email)) {
      alert('Email must be in the format firstname.moderator@metadite.com');
      return;
    }
    console.log('Moderator logging in with', email, password);
    // Redirect to moderator dashboard after simulation.
    navigate('/moderator/dashboard');
  };

  return (
    <div>
      <LoginForm onSubmit={handleModeratorLogin} title="Moderator Login" />
    </div>
  );
};

export default ModeratorLogin;
