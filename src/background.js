import 'libs/polyfills';
import browser from 'webextension-polyfill';
import { baseURLRegex } from 'constants/regex';

browser.runtime.onMessage.addListener(async msg => {
  if (msg.greeting === 'showOptionsPage') {
    browser.runtime.openOptionsPage();
  }
});

browser.tabs.onActivated.addListener(async function(activeInfo) {
  const tabs = await browser.tabs.query({ currentWindow: true, active: true });
  const [baseURL] = tabs[0].url.match(baseURLRegex);

  if (baseURL) {
    const { list, active, breakAt } = await browser.storage.local.get();

    try {
      browser.tabs.sendMessage(activeInfo.tabId, {
        breakAt,
        active,
        list,
        id: 'fromBackground',
      });
      return true;
    } catch (error) {
      return false;
    }
  }
});

browser.tabs.onUpdated.addListener(async (tabId, change, tab) => {
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
        return false;
      }
    }
  }
});
