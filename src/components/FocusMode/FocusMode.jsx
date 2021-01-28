// import TrashIcon from 'assets/icons/trash.svg';
import { Trash as TrashIcon } from '@styled-icons/feather/Trash';
import { Focus as FocusIcon } from '@styled-icons/remix-line/Focus';
import Box from 'components/Box';
import Control from 'components/Control';
import DateLabel from 'components/DateLabel';
import Input from 'components/Input';
import Switch from 'components/Switch';
import { ADD_LINK, REMOVE_LINK, UPDATE_LINK } from 'context/FocusMode';
import useActive from 'hooks/useActive';
import useList from 'hooks/useList';
import useBreak from 'hooks/useBreak';
import React, { useState } from 'react';
import styled from 'styled-components';
import Item from './Item';
import Text from './Text';
import BreakButton from 'components/BreakButton';

const Heading = styled.h1`
  font-size: 16px;
  margin: 0;
  margin-left: 0.6rem;
`;

const Description = styled.p`
  font-size: 14px;
  color: ${props => props.theme.font.secondary};
  margin-top: 0;
  margin-bottom: 18px;
  line-height: 1.8;
`;

export default ({ shouldSync }) => {
  const [url, setURL] = useState('');

  const { list, dispatch } = useList({ shouldSync });
  const { setActive, active } = useActive({ shouldSync });
  const { breakAt, isBreak, resetBreakAt, interval, endTime, remainingTime } = useBreak({
    shouldSync,
  });

  console.log('all in focusMode', { list, active, breakAt, isBreak, interval });

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
    setActive(!active);
  };

  // const handleBreak = () => {
  //   setBreakAt(new Date());
  // };

  const handleResume = () => {
    resetBreakAt();
  };
  return (
    <Box display="flex" flexDirection="column" height="420px">
      <Box display="flex" justifyContent="space-between">
        <Box width="100%">
          <Box
            display="flex"
            alignItems="center"
            mb={3}
            width="100%"
            justifyContent="space-between"
          >
            <Box display="flext" alignItems="center">
              <FocusIcon size={24} color="#1881f2" />{' '}
              <Heading>
                {active
                  ? isBreak
                    ? "You're on a break"
                    : 'Focus mode is ON'
                  : 'Focus mode is OFF'}
              </Heading>
            </Box>
            {!isBreak && <Switch onChange={toggle} checked={active} />}
          </Box>

          {active ? (
            isBreak ? (
              <Description>Focus mode will resume {remainingTime}.</Description>
            ) : (
              <Description>Distracting sites are pause</Description>
            )
          ) : (
            <Description>Turn on to pause distracting sites</Description>
          )}
          {isBreak && (
            // <Box width="100%" justifyContent="flex-end" display="flex">
            <BreakButton onClick={handleResume} fontSize="12px">
              Resume now
            </BreakButton>
            // </Box>
          )}
        </Box>
      </Box>
      {/* <Box display="flex">
        {active && (
          <BreakButton onClick={handleBreak} fontSize="12px">
            Take a break for {interval} minutes
          </BreakButton>
        )}
      </Box> */}

      <Box mb={3} mt={3}>
        <DateLabel>OPTIONS</DateLabel>
      </Box>
      <Box flexShrink="0" mb={3}>
        <Input
          placeholder={'Enter a distracting website'}
          onKeyPress={addItem}
          value={url}
          onChange={handleInputChange}
        />
      </Box>
      <Box overflowY="auto" flexGrow="1" mb={4}>
        {list.map(({ id, url }) => (
          <Item key={id}>
            <Text id={id} title={url} value={url} update={updateItem} />
            <Control onClick={removeItem(id)}>
              <TrashIcon size={16} />
            </Control>
          </Item>
        ))}
      </Box>
    </Box>
  );
};
