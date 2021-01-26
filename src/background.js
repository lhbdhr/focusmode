import 'libs/polyfills';
import browser from 'webextension-polyfill';
import { baseURLRegex } from 'constants/regex';

browser.runtime.onMessage.addListener(async msg => {
  if (msg.greeting === 'showOptionsPage') {
    browser.runtime.openOptionsPage();
  }
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.tabs.get(activeInfo.tabId, async function(tab) {
    const [baseURL] = tab.url.match(baseURLRegex);
    if (baseURL) {
      const { list, active } = await browser.storage.sync.get();

      browser.tabs.sendMessage(activeInfo.tabId, {
        active,
        list,
        id: 'onActivated',
      });
    }
  });
});
