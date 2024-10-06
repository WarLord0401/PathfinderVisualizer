import {ThemeProvider, createGlobalStyle} from 'styled-components';

const lightTheme = {
  fontFamily: 'Roboto, sans-serif',
  mainColors: {
    per: '#2C3E50', // Rich Slate Blue
    grey: '#DDE2E7', // Pale Silver
    dark: '#6C5B7B', // Muted Mauve
    light: '#FFFFFF', // Pure White
    shade: '#7F8C8D', // Cool Grey
    background: '#FDFDFD', // Very Soft White
    white: '#FFFFFF',
  },
};

const darkTheme = {
  fontFamily: 'Roboto, sans-serif',
  mainColors: {
    per: '#16A085', // Jade Green
    grey: '#34495E', // Slate Grey
    dark: '#2C3E50', // Rich Slate Blue
    light: '#ECF0F1', // Soft Silver
    shade: '#565859', // Light Grey
    background: '#1C1C1C', // Almost Black
    white: '#616161', // Soft Silver
  },
};

// Create global styles including CSS variables
const GlobalStyles = createGlobalStyle`
    :root {
      --primary-bg: ${({theme}) => theme.mainColors.background};
      --primary-text: ${({theme}) => theme.mainColors.per};
      --header-bg: ${({theme}) => theme.mainColors.dark};
      --header-text: ${({theme}) => theme.mainColors.light};
      --grid-bg: ${({theme}) => theme.mainColors.shade};
      --right-bg: ${({theme}) => theme.mainColors.dark};
      --right-border: ${({theme}) => theme.mainColors.shade};
      --start-btn-bg: #1ABC9C; // Bright Green for Start Button
      --finish-btn-bg: #E74C3C; // Bright Red for Finish Button
      --wall-btn-bg: #8E44AD; // Vibrant Purple for Wall Button
      --visualize-btn-bg: #F39C12; // Bright Orange for Visualize Button
      --reset-btn-bg: #3498DB; // Clear Blue for Reset Button
      --method-btn-bg: ${({theme}) => theme.mainColors.shade};
      --method-btn-selected-bg: #2980B9; // Deep Blue for Selected Method
      --selected-border: #0077ff;
      --method-btn-hover-bg: ${({theme}) => theme.mainColors.shade};
      --method-btn-hover-text: ${({theme}) => theme.mainColors.per};
      --footer-bg: ${({theme}) => theme.mainColors.shade};
      --footer-text: ${({theme}) => theme.mainColors.light};
      --btn-text: ${({theme}) => theme.mainColors.background};
    }
  
    body {
      background-color: var(--primary-bg);
      color: var(--primary-text);
      font-family: ${({theme}) => theme.fontFamily};
    }
  `;

export const GlobalTheme = ({children, isDarkMode}) => {
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
};
