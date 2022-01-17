import useStore from './useStore';
import { useEffect } from 'react';
import browser from 'webextension-polyfill';

export default function useDarkMode({ shouldSync = false }) {
  const { darkMode, setDarkMode, currentTabId } = useStore();

  // Syncing with storage after data changed
  useEffect(() => {
    if (shouldSync) {
      browser.storage.local.set({ darkMode });

      if (currentTabId && browser && browser.tabs && browser.runtime?.id) {
        browser.tabs.sendMessage(currentTabId, {
          darkMode,
          id: 'onToggleDarkMode',
        });
      }
    }
  }, [darkMode, shouldSync, currentTabId, browser]);

  return {
    darkMode,
    setDarkMode,
  };
}
