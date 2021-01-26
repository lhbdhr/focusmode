import useStore from './useStore';
import { useEffect } from 'react';
import browser from 'webextension-polyfill';
// import getStubData from '../context/FocusMode/getStubData';
export const INIT = 'INIT';
export default function useList({ shouldSync }) {
  const { list, dispatch } = useStore();
  console.log('in useList', list);

  // Syncing with storage after data changed
  useEffect(() => {
    if (shouldSync) {
      console.log('syncing in useList...');
      browser.storage.sync.set({ list });
    }
  }, [list, shouldSync]);

  return {
    list,
    dispatch,
  };
}
