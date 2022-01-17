import useStore from './useStore';
import { useEffect } from 'react';
import browser from 'webextension-polyfill';

export default function useActive({ shouldSync = false }) {
  const { active, setActive, currentTabId, setIsBreak } = useStore();

  // Syncing with storage after data changed
  useEffect(() => {
    if (shouldSync) {
      browser.storage.local.set({ active });
      if (!active) {
        setIsBreak(false);
      }
      if (currentTabId && browser && browser.tabs && browser.runtime?.id) {
        browser.tabs.sendMessage(currentTabId,{
          active,
          id: 'onToggle',
        });
      }
    }
  }, [active, shouldSync, currentTabId, browser]);

  return {
    active,
    setActive,
  };
}
