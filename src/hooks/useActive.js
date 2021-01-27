import useStore from './useStore';
import { useEffect } from 'react';
import browser from 'webextension-polyfill';

export default function useActive({ shouldSync = false }) {
  const { active, setActive, currentTabId, resetBreakAt } = useStore();
  console.log('in useActive', { active });

  // Syncing with storage after data changed
  useEffect(() => {
    if (shouldSync) {
      console.log('syncing in useActive...');
      browser.storage.local.set({ active });
      if (!active) {
        resetBreakAt();
      }
      if (currentTabId) {
        browser.tabs.sendMessage(currentTabId, {
          active,
          id: 'onToggle',
        });
      }
    }
  }, [active, shouldSync, currentTabId]);

  return {
    active,
    setActive,
  };
}
