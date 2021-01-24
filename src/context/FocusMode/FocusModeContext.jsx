import React, { useReducer, useEffect, useRef, memo } from 'react';
import browser from 'webextension-polyfill';
import getStubData from './getStubData';

export const ADD_LINK = 'ADD_LINK';
export const REMOVE_LINK = 'REMOVE_LINK';
export const UPDATE_LINK = 'UPDATE_LINK';
export const REMOVE_ALL = 'REMOVE_ALL';
export const INIT = 'INIT';

const LinkContext = React.createContext([]);

const reducer = (state, { payload, type }) => {
  switch (type) {
    case ADD_LINK:
      return [
        {
          id: Math.random()
            .toString(16)
            .substr(2),
          url: payload,
        },
        ...state,
      ];
    case REMOVE_LINK:
      return state.filter(({ id }) => id !== payload);
    case UPDATE_LINK:
      return state.map(item => {
        if (item.id === payload.id) {
          return { ...item, url: payload.url };
        }

        return item;
      });

    case INIT:
      return payload;
    default:
      throw new Error(`No such action: ${type}`);
  }
};

const LinkProvider = memo(({ children }) => {
  const [state, dispatch] = useReducer(reducer, []);
  const initRef = useRef(false);

  // Sync with storage
  useEffect(() => {
    if (initRef.current) {
      browser.storage.sync.set({ list: state });
    }
  }, [state]);

  // Listen to storage change and update the list
  useEffect(() => {
    browser.storage.onChanged.addListener(changes => {
      if (changes.list) {
        dispatch({ type: INIT, payload: changes.list.newValue });
      }
    });
  }, []);

  // Initialize the list with saved items or with initial data
  useEffect(async () => {
    const { list } = await browser.storage.sync.get({ list: getStubData() });
    dispatch({ type: INIT, payload: list });
    initRef.current = true;
  }, []);

  return <LinkContext.Provider value={[state, dispatch]}>{children}</LinkContext.Provider>;
});

export { LinkProvider, LinkContext };
