import globalStyle from 'assets/styles/global';
import { ThemeProvider } from 'context/Theme';
import 'libs/polyfills';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import styled, { createGlobalStyle, StyleSheetManager } from 'styled-components';
import browser from 'webextension-polyfill';
import useStore from 'hooks/useStore';
import useList from 'hooks/useList';
import useActive from 'hooks/useActive';
import useBreak from 'hooks/useBreak';
import useFocusMode from 'hooks/useFocusMode';
import useDarkMode from 'hooks/useDarkMode';
import BreakButton from 'components/BreakButton';
import IconWrapper from 'components/IconWrapper';
import { Circle as CircleIcon, Hexagon as HexagonIcon } from '@styled-icons/feather';

const GlobalStyle = createGlobalStyle`
  :host {
    all: initial;
    ${globalStyle}
  }
`;

const root = document.createElement('div');
const shadow = root.attachShadow({ mode: 'open' });
shadow.resetStyleInheritance = true;

const appContainer = document.createElement('div');

shadow.appendChild(appContainer);

document.documentElement.appendChild(root);

const Div = styled.div`
  position: absolute;
  top: 200px;
  width: 320px;
  min-height: 108px;
  border-radius: 4px;
  padding: 20px;
  border: none;
  background-color: ${props => props.theme.background};
`;

const Dialog = styled.dialog`
  position: fixed;
  z-index: 99999999999;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: saturate(0.5);
  backdrop-filter: blur(2px);
`;

const StyledMenu = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: 30px;
  padding: 0;
`;

const Description = styled.p`
  font-size: 15px;
  color: ${props => props.theme.description};
`;

const Heading = styled.h2`
  margin-top: 0.2rem;
  margin-bottom: 0.3rem;
  font-size: 18px;
  margin-left: 0.6rem;
  font-weight: 600;
  color: ${props => props.theme.title};
`;

const Flex = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`;

const Blocked = ({ shouldSync, onCloseTab }) => {
  const { list } = useList({ shouldSync });
  const { active } = useActive({ shouldSync });
  const { setBreakAt, breakAt, isBreak, interval } = useBreak({ shouldSync });
  const { darkMode } = useDarkMode({ shouldSync });

  const { isFocusModeOn } = useFocusMode({ isActive: active, list, isBreak, breakAt });

  const handleBreak = () => {
    setBreakAt(new Date());

    browser.runtime.sendMessage({ type: 'onBreak', interval });
  };

  return (
    isFocusModeOn && (
      <Dialog open>
        <Div>
          <Flex>
            {active ? (
              <IconWrapper>
                <CircleIcon size={18} strokeWidth={2} color={darkMode ? '#dae1fb' : '#3055e8'} />
              </IconWrapper>
            ) : (
              <IconWrapper>
                <HexagonIcon size={18} strokeWidth={2} color={darkMode ? '#dae1fb' : '#3055e8'} />
              </IconWrapper>
            )}
            <Heading>Focus mode is on</Heading>
          </Flex>
          <Description>Distracting websites are blocked right now</Description>
          <StyledMenu>
            <BreakButton type="button" onClick={handleBreak} fontSize="12px">
              take a {interval} minutes break
            </BreakButton>

            <BreakButton type="button" onClick={onCloseTab} fontSize="12px">
              ok
            </BreakButton>
          </StyledMenu>
        </Div>
      </Dialog>
    )
  );
};

let shouldActive;

browser.runtime.onMessage.addListener(function(request) {
  if (request && request.command === 'resume-focus-mode') {
    shouldActive = request.shouldActive;
  }
});

const App = () => {
  const { fetch, dispatch, setActive, setBreakAt, darkMode, setDarkMode, active } = useStore();

  const initRef = useRef(null);

  const onCloseTab = () => {
    browser.runtime.sendMessage({ type: 'closeTab' });
  };

  useEffect(() => {
    browser.runtime.onMessage.addListener(function(request) {
      if (request && request.id === 'fromBackground') {
        setActive(request.active);
        setBreakAt(request.breakAt);
        dispatch({ type: 'INIT', payload: request.list });
      } else if (request && request.id === 'onToggle') {
        setActive(request.active);
      } else if (request && request.id === 'onChangeList') {
        dispatch({ type: 'INIT', payload: request.list });
      } else if (request && request.id === 'onBreak') {
        setBreakAt(request.breakAt);
      } else if (request && request.id === 'onToggleDarkMode') {
        setDarkMode(request.darkMode);
      } else if (request && request.command === 'resume-focus-mode') {
        setActive(false);
      }
    });
  }, []);

  useEffect(() => {
    if (shouldActive && !active) {
      setActive(shouldActive);
    }
  });

  useEffect(() => {
    fetch();
    initRef.current = true;
  }, []);

  return (
    <StyleSheetManager target={appContainer}>
      <ThemeProvider darkMode={darkMode}>
        <GlobalStyle />
        <Blocked shouldSync={initRef.current} onCloseTab={onCloseTab} />
      </ThemeProvider>
    </StyleSheetManager>
  );
};

ReactDOM.render(<App />, appContainer);
