import useStore from './useStore';
import { useEffect, useMemo } from 'react';
import browser from 'webextension-polyfill';
import dayjs from 'dayjs';

export default function useBreak({ shouldSync = false }) {
  const { setBreakAt, breakAt: breakAtJSON, interval, resetBreak } = useStore();

  const breakAt = dayjs(breakAtJSON).toDate();

  // Syncing with storage after data changed
  useEffect(() => {
    if (shouldSync) {
      console.log('syncing in useBreak...');
      browser.storage.local.set({ breakAt: dayjs(breakAt).toJSON() });
    }
  }, [shouldSync, breakAt]);

  const now = new Date().getTime();

  const isBreak = useMemo(() => {
    if (breakAt) {
      return dayjs().isBefore(dayjs(breakAt).add(interval, 'minute'));
    }
    return false;
  }, [now, breakAt, interval]);

  console.log('in useBreak', { isBreak });

  return {
    setBreakAt,
    breakAt,
    isBreak,
    resetBreak,
  };
}
