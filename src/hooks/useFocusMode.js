import { useMemo } from 'react';
import { baseURLRegex } from 'constants/regex';

const useFocusMode = ({ list, isActive }) => {
  const [baseURL] = window.location.href.match(baseURLRegex);
  const isFocusModeOn = useMemo(() => {
    const pausedURL = list.map(({ url }) => {
      const [baseURL] = url.match(baseURLRegex);
      return baseURL;
    });

    const isPause = pausedURL.includes(baseURL);

    return isPause && isActive;
  }, [isActive, list]);

  return { isFocusModeOn, baseURL };
};

export default useFocusMode;
