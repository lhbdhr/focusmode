import browser from 'webextension-polyfill';
import create from 'zustand';
import getStubData from '../context/FocusMode/getStubData';

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
    setActive: active => {
      set(() => ({ active }));
    },
    fetch: async () => {
      const { active, list } = await browser.storage.sync.get({
        active: false,
        list: getStubData(),
      });
      set({ active, list });
      return { active, list };
    },
    dispatch: ({ type, payload }) => {
      set(state => ({ list: reducer(state.list, { type, payload }) }));
    },
  };
});

export default useStore;
