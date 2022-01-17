import useStore from './useStore';
import { useEffect } from 'react';
import browser from 'webextension-polyfill';
// import getStubData from '../context/FocusMode/getStubData';
export const INIT = 'INIT';
export default function useList({ shouldSync }) {
  const { list, dispatch, currentTabId } = useStore();

  // Syncing with storage after data changed
  useEffect(() => {
    if (shouldSync) {
      browser.storage.local.set({ list });
      if (currentTabId && browser && browser.tabs && browser.runtime?.id) {
        browser.tabs.sendMessage(currentTabId, {
          list,
          id: 'onChangeList',
        });
      }
    }
  }, [list, shouldSync, currentTabId, browser]);

  return {
    list,
    dispatch,
  };
}