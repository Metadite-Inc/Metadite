
import React from 'react';
import { useTheme } from '../../context/ThemeContext';

// This component will be used for any reusable chat UI elements
// Currently empty but can be expanded for shared chat components

const ChatPageComponent = ({ children }) => {
  const { theme } = useTheme();
  
  return (
    <div className={`chat-page-container ${theme === 'dark' ? 'dark' : 'light'}`}>
      {children}
    </div>
  );
};

export default ChatPageComponent;
