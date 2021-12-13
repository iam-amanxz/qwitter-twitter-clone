import { createContext, useContext, useState } from 'react';

export const themes = {
  baseThemes: {
    light: {
      name: 'Light',
      backgroundColor: '#fff',
      backgroundLightColor: '#E8E8E8',
      overlayColor: 'rgba(0,0,0,0.5)',
      backgroundHoverColor: '#f1f5f9',
      textPrimaryColor: '#000',
      textSecondaryColor: '#3a3a3a',
      borderColor: '#f1f5f9',
      borderColorAlt: '#E3E6EA',
      contrastBtnBgColor: '#333',
      contrastBtnBgHoverColor: '#0f172a',
      contrastBtnTextColor: '#fff',
    },
    dim: {
      name: 'Dim',
      backgroundColor: '#15202b',
      backgroundLightColor: '#15202b',
      overlayColor: '#101921',
      backgroundHoverColor: '#1C2B3A',
      textPrimaryColor: '#fff',
      textSecondaryColor: '#869DB3',
      borderColor: '#1c2b3a',
      borderColorAlt: '#233649',
      contrastBtnBgColor: '#fff',
      contrastBtnBgHoverColor: '#e2e8f0',
      contrastBtnTextColor: '#15202b',
    },
    dark: {
      name: 'Lights out',
      backgroundColor: '#000',
      backgroundLightColor: '#111',
      overlayColor: '#151515',
      backgroundHoverColor: '#1A1A1A',
      textPrimaryColor: '#fff',
      textSecondaryColor: '#b1b1b1',
      borderColor: '#1a1a1a',
      borderColorAlt: '#2A2A2A',
      contrastBtnBgColor: '#fff',
      contrastBtnBgHoverColor: '#e2e8f0',
      contrastBtnTextColor: '#000',
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
