import useStore from './useStore';
import { useEffect } from 'react';
import browser from 'webextension-polyfill';
import getStubData from '../context/FocusMode/getStubData';
export const INIT = 'INIT';
export default function useList() {
  const { list, dispatch } = useStore();
  console.log('in useList', list);

  // useEffect(async () => {
  //   console.log('fetching in useList...');
  //   const { list } = await browser.storage.sync.get({ list: getStubData() });

  //   console.log('result in useList', list);
  //   dispatch({ type: INIT, payload: list });
  // }, []);

  // Syncing with storage after data changed
  useEffect(() => {
    console.log('syncing in useList...');

    browser.storage.sync.set({ list });
  }, [list]);

  return {
    list,
    dispatch,
  };
}
