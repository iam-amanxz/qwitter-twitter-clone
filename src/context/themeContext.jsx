import { createContext, useContext, useState } from 'react';

export const themes = {
  baseThemes: {
    light: {
      name: 'Light',
      backgroundColor: '#fff',
      backgroundLightColor: '#f7f9f9',
      overlayColor: 'rgba(0,0,0,0.5)',
      backgroundHoverColor: '#e2e8f0',
      textPrimaryColor: '#000',
      textSecondaryColor: '#000',
      borderColor: '#e2e8f0',
    },
    dim: {
      name: 'Dim',
      backgroundColor: '#15202b',
      backgroundLightColor: '#15202b',
      overlayColor: '#0f172a',
      backgroundHoverColor: '#0f172a',
      textPrimaryColor: '#fff',
      textSecondaryColor: '#fff',
      borderColor: '#0f172a',
    },
    dark: {
      name: 'Lights out',
      backgroundColor: '#000',
      backgroundLightColor: '#111',
      overlayColor: '#0f172a',
      backgroundHoverColor: '#0f172a',
      textPrimaryColor: '#fff',
      textSecondaryColor: '#fff',
      borderColor: '#0f172a',
    },
  },
  accentThemes: {
    colombo: {
      textColor: '#fff',
      accentColor: '#22c55e',
      accentHoverColor: '#16a34a',
    },
    tokyo: {
      textColor: '#fff',
      accentColor: '#ef4444',
      accentHoverColor: '#dc2626',
    },
    doha: {
      textColor: '#fff',
      accentColor: '#3b82f6',
      accentHoverColor: '#2563eb',
    },
    osaka: {
      textColor: '#fff',
      accentColor: '#d946ef',
      accentHoverColor: '#c026d3',
    },
    beijing: {
      textColor: '#fff',
      accentColor: '#f59e0b',
      accentHoverColor: '#d97706',
    },
    denver: {
      textColor: '#fff',
      accentColor: '#9333ea',
      accentHoverColor: '#7e22ce',
    },
  },
};

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [baseTheme, setBaseTheme] = useState(themes.baseThemes.light);
  const [accentTheme, setAccentTheme] = useState(themes.accentThemes.colombo);
  const value = {
    themes,
    baseTheme,
    setBaseTheme,
    accentTheme,
    setAccentTheme,
  };

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
