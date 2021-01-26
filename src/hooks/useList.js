import useStore from './useStore';
import { useEffect } from 'react';
import browser from 'webextension-polyfill';

export default function useList() {
  const { list, dispatch } = useStore();

  // Syncing with storage after data changed
  useEffect(() => {
    console.log('syncing...');

    browser.storage.sync.set({ list });
  }, [list, dispatch]);

  return {
    list,
    dispatch,
  };
}
