import globalStyle from 'assets/styles/global';
import { OptionsProvider } from 'context/Options';
import { ThemeProvider } from 'context/Theme';
import 'libs/polyfills';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styled, { createGlobalStyle, StyleSheetManager } from 'styled-components';
import browser from 'webextension-polyfill';
import { Focus as FocusIcon } from '@styled-icons/remix-line/Focus';
import { baseURLRegex } from 'constants/regex';

const GlobalStyle = createGlobalStyle`
  :host {
    all: initial;
    ${globalStyle}
  }
`;

const root = document.createElement('div');
const shadow = root.attachShadow({ mode: 'open' });

const styleContainer = document.createElement('div');
const appContainer = document.createElement('div');

shadow.appendChild(styleContainer);
shadow.appendChild(appContainer);

document.body.appendChild(root);

const DialogContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  visibility: visible;
  &:before {
    content: '';
    background: rgba(0, 0, 0, 0.8);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999999999999999999999999999;
  }
`;

const Dialog = styled.dialog`
  background: white;
  position: absolute;
  left: 0%;
  top: 32%;
  width: 300px;
  height: 132px;
  border-radius: 4px;
  z-index: 99999999999999999999999999;

  padding-left: 20px;
  padding-right: 20px;
  border: none;
`;

const StyledMenu = styled.menu`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 0;
`;

const StyledButton = styled.button`
  font-size: 12px;
  cursor: pointer;
  appearance: none;
  transition: all 250ms;
  user-select: none;
  position: relative;
  white-space: nowrap;
  vertical-align: middle;
  outline: none;
  width: auto;
  line-height: 1.2;
  border-radius: 0.375rem;
  font-weight: 500;
  height: 2.5rem;
  min-width: 2.5rem;
  padding-left: 12px;
  padding-right: 12px;
  color: #1881f2;
  background: transparent;
  border: none;
  text-transform: uppercase;
  &:hover {
    background: #ecf5fe;
  }
`;

const Description = styled.p`
  color: ${props => props.theme.font.secondary};
`;

const Heading = styled.h2`
  margin-top: 0.2rem;
  margin-bottom: 0.3rem;
  font-size: 18px;
  margin-left: 0.6rem;
  font-weight: 600;
`;

const Flex = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`;

const App = () => {
  const [active, setActive] = useState(false);
  const [pageData, setPageData] = useState({ baseURL: '' });

  useEffect(() => {
    // listen for messages sent from background.js
    // browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    //   if (request.message) {
    //     setActive(true);
    //     setPageData({ baseURL: request.message, tabId: request.tabId });
    //   }
    // });

    const getList = async () => {
      const { list, active: focusModeActive } = await browser.storage.sync.get();

      const [baseURL] = window.location.href.match(baseURLRegex);
      const pausedURL = list.map(({ url }) => {
        const [baseURL] = url.match(baseURLRegex);
        return baseURL;
      });

      const isPause = pausedURL.includes(baseURL);

      if (isPause && focusModeActive) {
        setActive(true);
        setPageData({ baseURL });
      }
    };
    getList();
  }, []);

  return (
    <StyleSheetManager target={styleContainer}>
      <OptionsProvider>
        <ThemeProvider>
          <GlobalStyle />
          {active && (
            <DialogContainer>
              <Dialog open>
                <Flex>
                  <FocusIcon size={24} color="#1881f2" />
                  <Heading>Focus mode is on</Heading>
                </Flex>
                <Description>
                  {pageData.baseURL} and other distracting sites are paused right now
                </Description>
                <StyledMenu>
                  <StyledButton type="button">use it for 5 minutes</StyledButton>
                </StyledMenu>
              </Dialog>
            </DialogContainer>
          )}
        </ThemeProvider>
      </OptionsProvider>
    </StyleSheetManager>
  );
};

ReactDOM.render(<App />, appContainer);
