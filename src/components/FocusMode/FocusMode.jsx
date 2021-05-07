// import TrashIcon from 'assets/icons/trash.svg';
import {
  Trash as TrashIcon,
  Coffee as CoffeeIcon,
  Circle as CircleIcon,
  Hexagon as HexagonIcon,
  Sun as SunIcon,
  Moon as MoonIcon,
} from '@styled-icons/feather';
import Box from 'components/Box';
import Control from 'components/Control';
import DateLabel from 'components/DateLabel';
import Input from 'components/Input';
import Switch from 'components/Switch';
import { ADD_LINK, REMOVE_LINK, UPDATE_LINK } from 'hooks/useStore';
import useActive from 'hooks/useActive';
import useList from 'hooks/useList';
import useBreak from 'hooks/useBreak';
import useDarkMode from 'hooks/useDarkMode';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Item from './Item';
import URL from './URL';
import BreakButton from 'components/BreakButton';
import IconWrapper from 'components/IconWrapper';
import browser from 'webextension-polyfill';
import useInterval from '@use-it/interval';

const Text = styled.span`
  flex-grow: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  padding-left: 8px;
  font-size: 12px;
`;

const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
  border-radius: 4px;
  padding: 8px;
  margin-bottom: 14px;
  transition: all 0.2s ease-in-out;
  color: ${props => props.theme.palette.secondary};
  cursor: pointer;
  outline: none;

  :hover {
    background-color: ${props => props.theme.darkModeButton.background};
    color: ${props => props.theme.darkModeButton.color};
  }
`;

const Heading = styled.h1`
  font-size: 16px;
  margin: 0;
  margin-left: 0.6rem;
  color: ${props => props.theme.title};
`;

const Description = styled.p`
  font-size: 14px;
  color: ${props => props.theme.description};
  margin-top: 0;
  margin-bottom: 12px;
  line-height: 1.8;
`;

const TimerText = styled.p`
  color: ${props => props.theme.description};
  margin-top: 0;
  margin-bottom: 12px;
  line-height: 1.8;
  text-align: center;
  margin-left: 4px;
`;

const Timer = ({ target, setIsBreak, setTarget }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [interval, setInterval] = useState(0);

  useInterval(() => {
    if (target) {
      setInterval(100);
      const remaining = (new Date(target) - new Date()) / 1000;

      const minutes = ~~(remaining / 60);
      const seconds = ~~(remaining % 60);

      const timeLeft = `${minutes}:${('00' + seconds).slice(-2)}`;

      setTimeLeft(timeLeft);

      if (remaining < 0) {
        setInterval(null);
        setIsBreak(false); // stop the timer
        setTarget(undefined);
      }
    }
  }, interval);

  return <TimerText>{timeLeft}</TimerText>;
};

export default ({ shouldSync }) => {
  const [url, setURL] = useState('');

  const { list, dispatch } = useList({ shouldSync });
  const { setActive, active } = useActive({ shouldSync });
  const { setDarkMode, darkMode } = useDarkMode({ shouldSync });
  const { isBreak, setIsBreak, interval, target, setTarget } = useBreak({
    shouldSync,
  });

  const handleInputChange = ({ target: { value } }) => setURL(value);

  const removeItem = id => () => dispatch({ type: REMOVE_LINK, payload: id });

  const addItem = ({ target: { value }, key }) => {
    if (key.toLowerCase() === 'enter' && value.trim().length > 0) {
      dispatch({ type: ADD_LINK, payload: value.trim() });
      setURL('');
    }
  };
  const updateItem = payload => dispatch({ type: UPDATE_LINK, payload });

  const toggle = () => {
    if (active) {
      browser.runtime.sendMessage({ type: 'onInactive' });
    } else {
      browser.runtime.sendMessage({ type: 'onActive' });
    }
    setActive(!active);
  };

  const handleBreak = async () => {
    setIsBreak(true);
    const target = await browser.runtime.sendMessage({
      type: 'onBreak',
      interval,
    });

    setTarget(target);
  };

  const handleResume = () => {
    setIsBreak(false);
    setTarget(undefined);
    browser.runtime.sendMessage({
      type: 'onResume',
    });
  };

  const handleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // useEffect(() => {
  //   const isDarkMode =
  //     window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  //   if (isBreak) {
  //     if (isDarkMode) {
  //       browser.browserAction.setIcon({ path: './assets/img/coffee-dark-mode.png' });
  //     } else {
  //       browser.browserAction.setIcon({ path: './assets/img/coffee.png' });
  //     }
  //   }
  //   if (active) {
  //     if (isDarkMode) {
  //       browser.browserAction.setIcon({ path: './assets/img/circle-dark-mode.png' });
  //     } else {
  //       browser.browserAction.setIcon({ path: './assets/img/circle.png' });
  //     }
  //   } else {
  //     if (isDarkMode) {
  //       browser.browserAction.setIcon({ path: './assets/img/hexagon-dark-mode.png' });
  //     } else {
  //       browser.browserAction.setIcon({ path: './assets/img/hexagon.png' });
  //     }
  //   }
  // }, []);
  return (
    <Box display="flex" flexDirection="column" height="520px">
      <Box display="flex" justifyContent="space-between">
        <Box width="100%">
          <Box
            display="flex"
            alignItems="center"
            mb={'10px'}
            width="100%"
            justifyContent="space-between"
          >
            <Box display="flext" alignItems="center">
              {isBreak ? (
                <IconWrapper>
                  <CoffeeIcon size={18} strokeWidth={2} color={darkMode ? '#dae1fb' : '#3055e8'} />
                </IconWrapper>
              ) : active ? (
                <IconWrapper>
                  <CircleIcon size={18} strokeWidth={2} color={darkMode ? '#dae1fb' : '#3055e8'} />
                </IconWrapper>
              ) : (
                <IconWrapper>
                  <HexagonIcon size={18} strokeWidth={2} color={darkMode ? '#dae1fb' : '#3055e8'} />
                </IconWrapper>
              )}

              <Heading>
                {active
                  ? isBreak
                    ? "You're on a break"
                    : 'Focus mode is on'
                  : 'Focus mode is off'}
              </Heading>
            </Box>
            {!isBreak && <Switch onChange={toggle} checked={active} />}
          </Box>

          {active ? (
            isBreak ? (
              <Box display="flex" width="100%" alignItems="baseline">
                <Description>Focus mode will resume in</Description>
                <Timer target={target} setIsBreak={setIsBreak} setTarget={setTarget} />{' '}
              </Box>
            ) : (
              <Description>Distracting websites are now blocked</Description>
            )
          ) : (
            <Description>Turn on to block distracting websites</Description>
          )}

          {isBreak ? (
            <BreakButton onClick={handleResume} fontSize="12px">
              Resume now
            </BreakButton>
          ) : active ? (
            <BreakButton onClick={handleBreak} fontSize="12px">
              Take a {interval} minutes break
            </BreakButton>
          ) : (
            <Box height="22px"></Box>
          )}
        </Box>
      </Box>

      <Box mb={3} mt={4}>
        <DateLabel>OPTIONS</DateLabel>
      </Box>
      <Box flexShrink="0" mb={3}>
        <Input
          placeholder={'Enter a distracting website link'}
          onKeyPress={addItem}
          value={url}
          onChange={handleInputChange}
        />
      </Box>
      <Box overflowY="auto" flexGrow="1" mb={4}>
        {list.map(({ id, url }) => (
          <Item key={id}>
            <URL id={id} title={url} value={url} update={updateItem} />
            <Control onClick={removeItem(id)}>
              <TrashIcon size={16} />
            </Control>
          </Item>
        ))}
      </Box>
      <Box w="100%" display="flex" justifyContent="flex-end">
        <IconButton onClick={handleDarkMode}>
          {darkMode ? (
            <>
              <SunIcon size={16} strokeWidth={1.8} />
              <Text>Light Mode</Text>
            </>
          ) : (
            <>
              <MoonIcon strokeWidth={1.8} size={16} />
              <Text>Dark Mode</Text>
            </>
          )}
        </IconButton>
      </Box>
    </Box>
  );
};
