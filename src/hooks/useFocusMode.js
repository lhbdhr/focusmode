import { useMemo } from 'react';
import { baseURLRegex } from 'constants/regex';

const useFocusMode = ({ list, isActive, isBreak }) => {
  const [baseURL] = window.location.href.match(baseURLRegex);
  const isFocusModeOn = useMemo(() => {
    const pausedURL = list.map(({ url }) => {
      const [baseURL] = url.match(baseURLRegex);
      return baseURL;
    });

    const isPause = pausedURL.includes(baseURL);

    return isPause && isActive && !isBreak;
  }, [isActive, list, isBreak]);

  return { isFocusModeOn, baseURL };
};

export default useFocusMode;
