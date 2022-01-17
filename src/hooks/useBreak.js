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
    console.log({shouldSync})
    if (shouldSync) {
      browser.storage.local.set({ isBreak });
      try {
        if (currentTabId && browser && browser.tabs && browser.runtime?.id) {
          browser.tabs.sendMessage(currentTabId,{
            isBreak,
            id: 'onBreak',
          });
          console.log("send from onBreak")
        }
      } catch (err) {
        console.log("onBreak", err)
      }
    }
  }, [isBreak, shouldSync, currentTabId, browser]);

  return {
    setIsBreak,
    isBreak,
    interval,
    target,
    setTarget,
  };
}
