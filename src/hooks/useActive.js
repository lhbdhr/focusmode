import useStore from './useStore';
import { useEffect } from 'react';
import browser from 'webextension-polyfill';

export default function useActive({ shouldSync = false }) {
  const { active, setActive } = useStore();
  console.log('in useActive', active);

  // Syncing with storage after data changed
  useEffect(() => {
    if (shouldSync) {
      console.log('syncing in useActive...', active);
      browser.storage.sync.set({ active });
    }
  }, [active, shouldSync]);

  return {
    active,
    setActive,
  };
}
