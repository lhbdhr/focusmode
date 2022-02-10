import useStore from './useStore';
import { useEffect } from 'react';
import browser from 'webextension-polyfill';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export default function useBreak({ shouldSync = false }) {
  const { setIsBreak, isBreak, interval, currentTabId } = useStore();

  // Syncing with storage after data changed
  useEffect(() => {
    if (shouldSync) {
      browser.storage.local.set({ isBreak });

      if (currentTabId && browser && browser.tabs && browser.runtime?.id) {
        browser.tabs.sendMessage(currentTabId, {
          isBreak: isBreak,
          id: 'onBreak',
        });
      }
    }
  }, [isBreak, shouldSync, currentTabId]);

  return {
    setIsBreak,
    isBreak,
    interval,
  };
}
