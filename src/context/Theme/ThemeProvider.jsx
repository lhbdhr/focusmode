import React from 'react';
import { ThemeProvider as BaseThemProvider } from 'styled-components';
import light from 'theme/light';
import dark from 'theme/dark';

const ThemeProvider = ({ children }) => {
  return <BaseThemProvider theme={light}>{children}</BaseThemProvider>;
};

export default ThemeProvider;
