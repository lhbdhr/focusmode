import useStore from './useStore';
import { useEffect } from 'react';
import browser from 'webextension-polyfill';

export default function useActive() {
  const { active, setActive } = useStore();
  console.log('in useActive', active);

  // useEffect(async () => {
  //   console.log('fetching in useActive...');
  //   const { active } = await browser.storage.sync.get({ active: false });

  //   console.log('result in useActive', active);
  //   setActive(active);
  // }, []);

  // Syncing with storage after data changed
  useEffect(() => {
    console.log('syncing in useActive...', active);
    browser.storage.sync.set({ active });
  }, [active]);

  return {
    active,
    setActive,
  };
}
