import browser from 'webextension-polyfill';
import create from 'zustand';
import getStubData from '../context/FocusMode/getStubData';
import dayjs from 'dayjs';

export const ADD_LINK = 'ADD_LINK';
export const REMOVE_LINK = 'REMOVE_LINK';
export const UPDATE_LINK = 'UPDATE_LINK';
export const INIT = 'INIT';

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
    case UPDATE_LINK:
      return state.map(link => {
        if (link.id === payload.id) {
          return { ...link, url: payload.url };
        }

        return link;
      });

    case REMOVE_LINK:
      return state.filter(({ id }) => id !== payload);

    case INIT:
      return payload;
    default:
      throw new Error(`No such action: ${type}`);
  }
};

const useStore = create(set => {
  return {
    active: false,
    list: [],
    currentTabId: '',
    isBreak: false,
    interval: 5,
    target: undefined,
    darkMode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
    setDarkMode: darkMode => {
      set(() => ({ darkMode }));
    },
    setActive: active => {
      set(() => ({ active }));
    },
    setIsBreak: isBreak => {
      set(() => ({ isBreak }));
    },
    setTarget: target => {
      set(() => ({ target }));
    },
    setInterval: interval => {
      set(() => ({ interval: interval * 60000 }));
    },
    fetch: async () => {
      try {
        const {
          active,
          list,
          isBreak,

          interval,
          darkMode,
        } = await browser?.storage?.local.get({
          active: false,
          list: getStubData(),
          isBreak: false,
          interval: 0.1,
          darkMode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
        });

        set({
          active,
          list,
          interval,

          isBreak,
          darkMode,
        });
        return {
          active,
          list,
          interval,

          isBreak,
          darkMode,
        };
      } catch (error) {
        console.log('error fetching from local storage', error);
      }
    },
    getCurrentTabId: async () => {
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });

      set({ currentTabId: tabs[0].id });
    },
    dispatch: ({ type, payload }) => {
      set(state => ({ list: reducer(state.list, { type, payload }) }));
    },
  };
});

export default useStore;
