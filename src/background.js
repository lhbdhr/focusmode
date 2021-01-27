import 'libs/polyfills';
import browser from 'webextension-polyfill';
import { baseURLRegex } from 'constants/regex';
// import dayjs from dayjs

browser.runtime.onMessage.addListener(async msg => {
  if (msg.greeting === 'showOptionsPage') {
    browser.runtime.openOptionsPage();
  }
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.tabs.get(activeInfo.tabId, async function(tab) {
    const [baseURL] = tab.url.match(baseURLRegex);
    if (baseURL) {
      const { list, active, breakAt } = await browser.storage.local.get();
      // const isBreak = breakAt ? dayjs().isBefore(dayjs(breakAt).add(interval, 'minute')): false;

      browser.tabs.sendMessage(activeInfo.tabId, {
        breakAt,
        active,
        list,
        id: 'onActivated',
      });
    }
  });
});
