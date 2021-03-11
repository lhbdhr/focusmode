import React from 'react';
import { ThemeProvider as BaseThemProvider } from 'styled-components';
import light from 'theme/light';
import dark from 'theme/dark';
import useDarkMode from 'hooks/useDarkMode';

const ThemeProvider = ({ children, shouldSync }) => {
  const { darkMode } = useDarkMode({ shouldSync: false });
  return <BaseThemProvider theme={darkMode ? dark : light}>{children}</BaseThemProvider>;
};

export default ThemeProvider;
