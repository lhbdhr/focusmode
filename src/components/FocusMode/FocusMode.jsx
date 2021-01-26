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
import React, { useState } from 'react';
import styled from 'styled-components';
import Item from './Item';
import Text from './Text';

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
`;

export default ({ shouldSync }) => {
  const [url, setURL] = useState('');

  const { list, dispatch } = useList({ shouldSync });
  const { setActive, active } = useActive({ shouldSync });

  console.log('all in focusMode', { list, active });

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

  return (
    <Box display="flex" flexDirection="column" height="420px">
      <Box display="flex" justifyContent="space-between">
        <Box>
          <Box display="flex" alignItems="center" mb={3}>
            <FocusIcon size={24} color="#1881f2" />{' '}
            <Heading>Focus mode is {active ? 'ON' : 'OFF'}</Heading>
          </Box>

          {active ? (
            <Description>Distracting sites are pause</Description>
          ) : (
            <Description>Turn on to pause distracting sites</Description>
          )}
        </Box>
        {/* <button onClick={toggle} style={{ cursor: 'pointer' }}>
          {active ? 'on' : 'off'}
        </button> */}
        <Switch onChange={toggle} checked={active} />
      </Box>
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
      <Box overflowY="auto" flexGrow="1">
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
