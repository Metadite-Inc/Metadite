
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StaffNavbar from '../components/StaffNavbar';
import StaffFooter from '../components/StaffFooter';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import ModeratorAssignmentsView from '../components/moderator/ModeratorAssignmentsView';
import AdminAssignmentsView from '../components/admin/AdminAssignmentsView';

const ModeratorAssignments = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect users who don't have access (only admin and moderator can access)
    if (!user || (user.role !== 'moderator' && user.role !== 'admin')) {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  // Don't render if user doesn't have access
  if (!user || (user.role !== 'moderator' && user.role !== 'admin')) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <StaffNavbar />
      
      <div className={`flex-1 pt-20 pb-12 px-4 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-white via-metadite-light to-white'
      }`}>
        <div className="container mx-auto max-w-7xl">
          {user.role === 'admin' ? (
            <AdminAssignmentsView />
          ) : (
            <ModeratorAssignmentsView user={user} />
          )}
        </div>
      </div>
      
      <StaffFooter />
    </div>
  );
};

export default ModeratorAssignments;
