import {useEffect, useState} from 'react';

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle the theme between dark and light mode
  const toggleTheme = () => setIsDarkMode(prev => !prev);

  // Check if dark mode was previously saved in localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setIsDarkMode(JSON.parse(savedMode));
    }
  }, []);

  // Save the current dark mode state to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  return {isDarkMode, toggleTheme};
};
