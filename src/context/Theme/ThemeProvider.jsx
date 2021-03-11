import React from 'react';
import { ThemeProvider as BaseThemProvider } from 'styled-components';
import light from 'theme/light';
import dark from 'theme/dark';

const ThemeProvider = ({ children, darkMode }) => {
  return <BaseThemProvider theme={darkMode ? dark : light}>{children}</BaseThemProvider>;
};

export default ThemeProvider;
