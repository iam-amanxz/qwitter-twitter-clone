import { createContext, useContext, useState, useEffect } from 'react';

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
      overlayColor: 'rgb(16, 25, 33, 0.8)',
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
      overlayColor: 'rgb(21, 21, 21, 0.8)',
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
      name: 'colombo',
      textColor: '#fff',
      accentColor: '#22c55e',
      accentHoverColor: '#16a34a',
    },
    tokyo: {
      name: 'tokyo',
      textColor: '#fff',
      accentColor: '#ef4444',
      accentHoverColor: '#dc2626',
    },
    doha: {
      name: 'doha',
      textColor: '#fff',
      accentColor: '#3b82f6',
      accentHoverColor: '#2563eb',
    },
    osaka: {
      name: 'osaka',
      textColor: '#fff',
      accentColor: '#d946ef',
      accentHoverColor: '#c026d3',
    },
    beijing: {
      name: 'beijing',
      textColor: '#fff',
      accentColor: '#f59e0b',
      accentHoverColor: '#d97706',
    },
    denver: {
      name: 'denver',
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

  useEffect(() => {
    const base = localStorage.getItem('baseTheme');
    const accent = localStorage.getItem('accentTheme');
    if (base) {
      switch (base) {
        case 'Light':
          setBaseTheme(themes.baseThemes.light);
          break;
        case 'Dim':
          setBaseTheme(themes.baseThemes.dim);
          break;
        case 'Lights out':
          setBaseTheme(themes.baseThemes.dark);
          break;
      }
    }

    if (accent) {
      switch (accent) {
        case 'colombo':
          setAccentTheme(themes.accentThemes.colombo);
          break;
        case 'tokyo':
          setAccentTheme(themes.accentThemes.tokyo);
          break;
        case 'doha':
          setAccentTheme(themes.accentThemes.doha);
          break;
        case 'osaka':
          setAccentTheme(themes.accentThemes.osaka);
          break;
        case 'beijing':
          setAccentTheme(themes.accentThemes.beijing);
          break;
        case 'denver':
          setAccentTheme(themes.accentThemes.denver);
          break;
      }
    }
  }, []);

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
