import useStore from './useStore';
import { useEffect } from 'react';
import browser from 'webextension-polyfill';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export default function useBreak({ shouldSync = false }) {
  const { setIsBreak, isBreak, interval, currentTabId, target, setTarget } = useStore();

  // Syncing with storage after data changed
  useEffect(() => {
    if (shouldSync) {
      browser.storage.local.set({ isBreak });
      if (currentTabId) {
        browser.tabs.sendMessage(currentTabId, {
          isBreak,
          id: 'onBreak',
        });
      }
    }
  }, [isBreak, shouldSync, currentTabId]);

  return {
    setIsBreak,
    isBreak,
    interval,
    target,
    setTarget,
  };
}
