import useStore from './useStore';
import { useEffect } from 'react';
import browser from 'webextension-polyfill';
// import getStubData from '../context/FocusMode/getStubData';
export const INIT = 'INIT';
export default function useList({ shouldSync }) {
  const { list, dispatch, currentTabId } = useStore();
  console.log('in useList', list);

  // Syncing with storage after data changed
  useEffect(() => {
    if (shouldSync) {
      console.log('syncing in useList...');
      browser.storage.local.set({ list });
      if (currentTabId) {
        browser.tabs.sendMessage(currentTabId, {
          list,
          id: 'onChangeList',
        });
      }
    }
  }, [list, shouldSync, currentTabId]);

  return {
    list,
    dispatch,
  };
}
