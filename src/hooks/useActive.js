import useStore from './useStore';
import { useEffect } from 'react';
import browser from 'webextension-polyfill';

export default function useActive() {
  const { active, setActive } = useStore();

  // Syncing with storage after data changed
  useEffect(() => {
    console.log('syncing...');
    browser.storage.sync.set({ active });
  }, [active]);

  return {
    active,
    setActive,
  };
}
