import useStore from './useStore';
import { useEffect } from 'react';
import browser from 'webextension-polyfill';

export default function useTarget({ shouldSync = false }) {
  const { setTarget, target, currentTabId, setIsBreak } = useStore();

  // Syncing with storage after data changed

  useEffect(() => {
    if (shouldSync) {
      browser.storage.local.set({ target });

      if (!target) {
        setIsBreak(false);
      }
      if (currentTabId && browser && browser.tabs && browser.runtime?.id) {
        browser.tabs.sendMessage(currentTabId, {
          target,
          id: 'onTarget',
        });
      }
    }
  }, [target, shouldSync, currentTabId]);

  return {
    target,
    setTarget,
  };
}
