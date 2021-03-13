import 'libs/polyfills';
import browser from 'webextension-polyfill';
import { baseURLRegex } from 'constants/regex';

const media = window.matchMedia('(prefers-color-scheme: dark)');

browser.runtime.onMessage.addListener(async (request, sender) => {
  const isDarkMode = window.matchMedia && media.matches;

  if (request.greeting === 'showOptionsPage') {
    browser.runtime.openOptionsPage();
  }
  if (request.type == 'closeTab') {
    browser.tabs.remove(sender.tab.id);
  }

  if (request.type == 'onBreak') {
    if (isDarkMode) {
      return browser.browserAction.setIcon({ path: './assets/img/coffee-dark-mode.png' });
    }
    return browser.browserAction.setIcon({ path: './assets/img/coffee.png' });
  }
  if (request.type == 'onResume' || request.type == 'onActive') {
    if (isDarkMode) {
      return browser.browserAction.setIcon({ path: './assets/img/circle-dark-mode.png' });
    }
    return browser.browserAction.setIcon({ path: './assets/img/circle.png' });
  }
  if (request.type == 'onInactive') {
    if (isDarkMode) {
      return browser.browserAction.setIcon({ path: './assets/img/hexagon-dark-mode.png' });
    }
    return browser.browserAction.setIcon({ path: './assets/img/hexagon.png' });
  }
});

browser.runtime.onInstalled.addListener(function() {
  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (isDarkMode) {
    return browser.browserAction.setIcon({ path: './assets/img/hexagon-dark-mode.png' });
  }
  return browser.browserAction.setIcon({ path: './assets/img/hexagon.png' });
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
