import 'libs/polyfills';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { createGlobalStyle } from 'styled-components';
import { ThemeProvider } from 'context/Theme';
import { OptionsProvider } from 'context/Options';
import { LinkProvider } from 'context/FocusMode';
import FocusMode from 'components/FocusMode';
import Container from 'components/Container';
import useStore from 'hooks/useStore';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-size: 14px;
    min-height: 300px;
  }
`;

const Popup = () => {
  useEffect(() => {
    const { fetch } = useStore();
    fetch();
  }, []);

  return (
    <OptionsProvider>
      <ThemeProvider>
        <GlobalStyle />
        <LinkProvider>
          <Container>
            <FocusMode />
          </Container>
        </LinkProvider>
      </ThemeProvider>
    </OptionsProvider>
  );
};

const root = document.createElement('div');
document.body.appendChild(root);

ReactDOM.render(<Popup />, root);
