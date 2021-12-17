import React from 'react';

const NavContext = React.createContext();

const NavProvider = ({ children }) => {
  const [activeNav, setActiveNav] = React.useState('Home');

  const value = {
    activeNav,
    setActiveNav,
  };

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
};

export const useNav = () => {
  const context = React.useContext(NavContext);

  if (context === undefined) {
    throw new Error('useNav must be used within the NavProvider');
  }

  return context;
};

export default NavProvider;
