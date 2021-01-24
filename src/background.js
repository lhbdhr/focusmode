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
      const { list, active: focusModeActive } = await browser.storage.sync.get();

      const pausedURL = list.map(({ url }) => {
        const [baseURL] = url.match(baseURLRegex);
        return baseURL;
      });

      const isPause = pausedURL.includes(baseURL);

      if (isPause) {
        browser.tabs.sendMessage(activeInfo.tabId, {
          isPause,
          focusModeActive,
          baseURL,
        });
      }
    }
  });
});

// browser.tabs.onUpdated.addListener(async function(tabId, changeInfo, tab) {
//   if (changeInfo.url) {
//     const { list } = await browser.storage.sync.get();
//     const hostname = new URL(changeInfo.url).host;
//     const blockedHostname = list.map(({ url }) => url);
//     const isBlocked = blockedHostname.includes(hostname);

//     if (isBlocked) {
//       browser.tabs.sendMessage(tabId, {
//         message: hostname,
//         tabId,
//         url: changeInfo.url,
//       });
//     }
//   }
// });
