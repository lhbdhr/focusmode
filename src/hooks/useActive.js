import useStore from './useStore';
import { useEffect } from 'react';
import browser from 'webextension-polyfill';

export default function useActive({ shouldSync = false }) {
  const { active, setActive, currentTabId } = useStore();
  console.log('in useActive', active);

  // Syncing with storage after data changed
  useEffect(() => {
    if (shouldSync) {
      console.log('syncing in useActive...', active);
      browser.storage.sync.set({ active });
      if (currentTabId) {
        browser.tabs.sendMessage(currentTabId, {
          active,
          id: 'onToggle',
        });
      }
      console.log({ currentTabId });
    }
  }, [active, shouldSync]);

  return {
    active,
    setActive,
  };
}
