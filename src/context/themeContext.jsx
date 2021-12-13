import { createContext, useContext, useState } from 'react';

export const themes = {
  auth: {
    background: '#000',
    backgroundHover: '#171717',
    textPrimary: '#fff',
    textSecondary: '#eee',
    accent: '#69d100',
    accentHover: '#4f9e00',
    overlay: '#171717',
  },
  light: {
    foreground: '#000000',
    background: '#eeeeee',
  },
  dark: {
    foreground: '#ffffff',
    background: '#222222',
  },
};

const ThemeContext = createContext(themes.light);

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themes.light);
  const value = { theme, setTheme, themes };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within the ThemeProvider');
  }

  return context;
};

export default ThemeProvider;
