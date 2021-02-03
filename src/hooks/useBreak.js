import useStore from './useStore';
import { useEffect, useMemo } from 'react';
import browser from 'webextension-polyfill';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export default function useBreak({ shouldSync = false }) {
  const { setBreakAt, breakAt: breakAtJSON, interval, resetBreakAt, currentTabId } = useStore();

  const breakAt = dayjs(breakAtJSON).toDate();

  // Syncing with storage after data changed
  useEffect(() => {
    if (shouldSync) {
      browser.storage.local.set({ breakAt: dayjs(breakAt).toJSON() });
      if (currentTabId) {
        browser.tabs.sendMessage(currentTabId, {
          breakAt,
          id: 'onBreak',
        });
      }
    }
  }, [shouldSync, breakAt, currentTabId]);

  const now = new Date().getTime();

  const isBreak = useMemo(() => {
    if (breakAt) {
      return dayjs().isBefore(dayjs(breakAt).add(interval, 'minute'));
    }
    return false;
  }, [now, breakAt, interval]);

  const endTime = useMemo(() => {
    if (breakAt) {
      return dayjs(breakAt)
        .add(interval, 'minute')
        .format('h:mma');
    }
  }, [breakAt, interval]);

  const remainingTime = useMemo(() => {
    if (breakAt) {
      return dayjs(breakAt)
        .add(interval, 'minute')
        .fromNow();
    }
  }, [breakAt, interval]);

  return {
    setBreakAt,
    breakAt,
    isBreak,
    resetBreakAt,
    interval,
    endTime,
    remainingTime,
  };
}
