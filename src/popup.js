import 'libs/polyfills';
import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { createGlobalStyle } from 'styled-components';
import { ThemeProvider } from 'context/Theme';
import { OptionsProvider } from 'context/Options';
import FocusMode from 'components/FocusMode';
import Container from 'components/Container';
import useStore from 'hooks/useStore';
import browser from 'webextension-polyfill';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-size: 14px;
    min-height: 300px;
  }
`;

const Popup = () => {
  const initRef = useRef(null);
  const { fetch, list, active, getCurrentTabId } = useStore();
  useEffect(() => {
    fetch();
    getCurrentTabId();
    initRef.current = true;
  }, []);

  console.log('inside popup', { list, active });

  return (
    <OptionsProvider>
      <ThemeProvider>
        <GlobalStyle />
        <Container>
          <FocusMode shouldSync={initRef.current} />
        </Container>
      </ThemeProvider>
    </OptionsProvider>
  );
};

const root = document.createElement('div');
document.body.appendChild(root);

ReactDOM.render(<Popup />, root);
