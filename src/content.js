import globalStyle from 'assets/styles/global';
import { ThemeProvider } from 'context/Theme';
import 'libs/polyfills';
import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import styled, { createGlobalStyle, StyleSheetManager } from 'styled-components';
import browser from 'webextension-polyfill';
import { Focus as FocusIcon } from '@styled-icons/remix-line/Focus';
import useStore from 'hooks/useStore';
import useList from 'hooks/useList';
import useActive from 'hooks/useActive';
import useBreak from 'hooks/useBreak';
import useFocusMode from 'hooks/useFocusMode';
import BreakButton from 'components/BreakButton';

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
  width: 320px;
  min-height: 104px;
  border-radius: 4px;
  z-index: 99999999999999999999999999;
  padding-left: 20px;
  padding-right: 20px;
  border: none;
`;

const StyledMenu = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;

  padding: 0;
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

const Blocked = ({ shouldSync }) => {
  const { list } = useList({ shouldSync });
  const { active } = useActive({ shouldSync });
  const { setBreakAt, breakAt, isBreak, interval } = useBreak({ shouldSync });

  const { isFocusModeOn, baseURL } = useFocusMode({ isActive: active, list, isBreak, breakAt });

  const now = new Date().getTime();
  if (breakAt) {
    console.log('break is set', { list, active, isFocusModeOn, breakAt, now, isBreak });
  }

  const handleBreak = () => {
    setBreakAt(new Date());
  };
  return (
    isFocusModeOn && (
      <DialogContainer>
        <Dialog open>
          <Flex>
            <FocusIcon size={24} color="#1881f2" />
            <Heading>Focus mode is ON</Heading>
          </Flex>
          <Description>{baseURL} and other distracting sites are paused right now</Description>
          <StyledMenu>
            <BreakButton type="button" onClick={handleBreak} fontSize="12px">
              take a {interval} mins break
            </BreakButton>
          </StyledMenu>
        </Dialog>
      </DialogContainer>
    )
  );
};

const App = () => {
  const { fetch, dispatch, setActive, setBreakAt } = useStore();

  const initRef = useRef(null);

  useEffect(() => {
    browser.runtime.onMessage.addListener(function(request) {
      console.log('req', request);
      if (request && request.id === 'fromBackground') {
        console.log('fromBackground');
        setActive(request.active);
        setBreakAt(request.breakAt);
        dispatch({ type: 'INIT', payload: request.list });
      } else if (request && request.id === 'onToggle') {
        console.log('onToggle', { active: request.active });
        setActive(request.active);
      } else if (request && request.id === 'onChangeList') {
        console.log('onChangeList');

        dispatch({ type: 'INIT', payload: request.list });
      }
    });
  }, []);

  useEffect(() => {
    fetch();
    initRef.current = true;
  }, []);

  return (
    <StyleSheetManager target={styleContainer}>
      <ThemeProvider>
        <GlobalStyle />
        <Blocked shouldSync={initRef.current} />
      </ThemeProvider>
    </StyleSheetManager>
  );
};

ReactDOM.render(<App />, appContainer);
