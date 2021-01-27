import { useMemo } from 'react';
import { baseURLRegex } from 'constants/regex';

const useFocusMode = ({ list, isActive, isBreak, breakAt }) => {
  const [baseURL] = window.location.href.match(baseURLRegex);
  const isFocusModeOn = useMemo(() => {
    const pausedURL = list.map(({ url }) => {
      const [baseURL] = url.match(baseURLRegex);
      return baseURL;
    });

    const isPause = pausedURL.includes(baseURL);

    if (breakAt) {
      return isPause && isActive && !isBreak;
    }

    return isPause && isActive;
  }, [isActive, list, breakAt, isBreak]);

  return { isFocusModeOn, baseURL };
};

export default useFocusMode;
