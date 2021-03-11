import 'libs/polyfills';
import React, { useEffect, useRef, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { createGlobalStyle } from 'styled-components';
import { ThemeProvider } from 'context/Theme';
import Container from 'components/Container';
import useStore from 'hooks/useStore';
import lazy from 'preact-lazy';

const FocusMode = lazy(() => import('components/FocusMode'));

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-size: 14px;
    min-height: 300px;
  }
`;

const Popup = () => {
  const initRef = useRef(null);
  const { fetch, getCurrentTabId, darkMode } = useStore();
  useEffect(() => {
    fetch();
    getCurrentTabId();
    initRef.current = true;
  }, []);

  return (
    <ThemeProvider darkMode={darkMode}>
      <GlobalStyle />
      <Container>
        <Suspense fallback={<div>Loading...</div>}>
          <FocusMode shouldSync={initRef.current} />
        </Suspense>
      </Container>
    </ThemeProvider>
  );
};

const root = document.createElement('div');
document.body.appendChild(root);

ReactDOM.render(<Popup />, root);
