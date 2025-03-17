import React, { createContext, useState } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Define global styles for light and dark themes.
  const themeStyles = theme === 'light'
    ? { backgroundColor: '#f0f0f0', color: '#000' }
    : { backgroundColor: '#222', color: '#fff' };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themeStyles }}>
      {children}
    </ThemeContext.Provider>
  );
};
