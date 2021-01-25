// import TrashIcon from 'assets/icons/trash.svg';
import Box from 'components/Box';
import Button from 'components/Button';
import Control from 'components/Control';
import DateLabel from 'components/DateLabel';
import Input from 'components/Input';
import { ADD_LINK, LinkContext, REMOVE_LINK, UPDATE_LINK } from 'context/FocusMode';
import React, { useContext, useState } from 'react';
import browser from 'webextension-polyfill';
import Item from './Item';
import Text from './Text';
import Switch from 'components/Switch';
import styled from 'styled-components';
import { Focus as FocusIcon } from '@styled-icons/remix-line/Focus';
import { Trash as TrashIcon } from '@styled-icons/feather/Trash';
import useStore from 'hooks/useStore';

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

export default () => {
  const [url, setURL] = useState('');
  const [items, dispatch] = useContext(LinkContext);

  const handleInputChange = ({ target: { value } }) => setURL(value);

  const removeItem = id => () => dispatch({ type: REMOVE_LINK, payload: id });

  const addItem = ({ target: { value }, key }) => {
    if (key.toLowerCase() === 'enter' && value.trim().length > 0) {
      dispatch({ type: ADD_LINK, payload: value.trim() });
      setURL('');
    }
  };
  const updateItem = payload => dispatch({ type: UPDATE_LINK, payload });

  const { setActive, active } = useStore(state => state);
  const toggle = value => {
    setActive(value);
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
        {items.map(({ id, url }) => (
          <Item key={id}>
            <Text id={id} title={url} value={url} update={updateItem} />
            <Control onClick={removeItem(id)}>
              <TrashIcon size={16} />
            </Control>
          </Item>
        ))}
      </Box>
      {/* <Box display="flex" mt={2} mr={2} mb={3} justifyContent="flex-end">
        <Button onClick={() => browser.runtime.sendMessage({ greeting: 'showOptionsPage' })}>
          Setting
        </Button>
      </Box> */}
    </Box>
  );
};
