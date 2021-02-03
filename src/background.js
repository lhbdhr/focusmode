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
      const { list, active, breakAt } = await browser.storage.local.get();
      try {
        browser.tabs.sendMessage(activeInfo.tabId, {
          breakAt,
          active,
          list,
          id: 'fromBackground',
        });
      } catch (error) {
        return;
      }
    }
  });
});

chrome.tabs.onUpdated.addListener(async (tabId, change, tab) => {
  if (tab.active && change.url) {
    const [baseURL] = change.url.match(baseURLRegex);
    if (baseURL) {
      const { list, active, breakAt } = await browser.storage.local.get();
      try {
        browser.tabs.sendMessage(tabId, {
          breakAt,
          active,
          list,
          id: 'fromBackground',
        });
      } catch (error) {
        return;
      }
    }
  }
});
