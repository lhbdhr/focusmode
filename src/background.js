import 'libs/polyfills';
import browser from 'webextension-polyfill';
import { baseURLRegex } from 'constants/regex';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

let intervalID;
let targetEnd;

browser.runtime.onMessage.addListener(async (request, sender) => {
  const tabs = await browser.tabs.query({ currentWindow: true, active: true });
  const media = window.matchMedia('(prefers-color-scheme: dark)');

  const isDarkMode = window.matchMedia && media.matches;

  if (request.greeting === 'showOptionsPage') {
    browser.runtime.openOptionsPage();
  }
  if (request.type == 'closeTab') {
    browser.tabs.remove(sender.tab.id);
  }

  if (request.type == 'onBreak') {
    try {
      console.log({ tabs });

      const now = new Date();

      const target = new Date(now.getTime() + request.interval * 1000 * 60 + 500).toISOString();
      targetEnd = target;
      const countdown = () => {
        intervalID = setInterval(function() {
          const now = new Date();

          const remaining = (new Date(target) - now) / 1000;

          const minutes = ~~(remaining / 60);
          const seconds = ~~(remaining % 60);

          const timeLeft = `${minutes}:${('00' + seconds).slice(-2)}`;

          if (remaining <= 0) {
            browser.storage.local.set({ isBreak: false });

            if (tabs.length > 0) {
              const tabId = tabs[0].id;
              if (tabId) {
                browser.tabs.sendMessage(tabId, {
                  isBreak: false,
                  id: 'onBreak',
                });
              }
            }

            browser.browserAction.setBadgeText({ text: '' });
            clearInterval(intervalID);
          } else {
            browser.browserAction.setBadgeText({ text: timeLeft });
            browser.browserAction.setBadgeBackgroundColor({ color: '#374862' });
          }
        }, 100);
      };
      countdown();

      return Promise.resolve(target);
    } catch (error) {
      console.log('e', error);
    }
  }

  if (request.command == 'get-time') {
    return Promise.resolve({ target: targetEnd });
  }

  if (request.type == 'onResume') {
    clearInterval(intervalID);
    browser.browserAction.setBadgeText({ text: '' });
    if (isDarkMode) {
      return browser.browserAction.setIcon({ path: './assets/img/circle-dark-mode.png' });
    }
    return browser.browserAction.setIcon({ path: './assets/img/circle.png' });
  }
});

browser.runtime.onInstalled.addListener(async function() {
  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (isDarkMode) {
    browser.browserAction.setIcon({ path: './assets/img/circle-dark-mode.png' });
  } else {
    browser.browserAction.setIcon({ path: './assets/img/circle.png' });
  }

  const tabs = await browser.tabs.query({ currentWindow: true, active: true });

  if (tabs.length > 0) {
    const [baseURL] = tabs[0].url.match(baseURLRegex) ?? [];

    const tabId = tabs[0].id;
    if (baseURL) {
      const { list, active, isBreak } = await browser.storage.local.get();
      try {
        browser.tabs.sendMessage(tabId, {
          isBreak,
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

browser.tabs.onActivated.addListener(async function(activeInfo) {
  const tabs = await browser.tabs.query({ currentWindow: true, active: true });
  const [baseURL] = tabs[0].url.match(baseURLRegex) ?? [];

  if (baseURL) {
    const { list, active, isBreak } = await browser.storage.local.get();

    try {
      browser.tabs.sendMessage(activeInfo.tabId, {
        isBreak,
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
    const [baseURL] = change.url.match(baseURLRegex) ?? [];
    if (baseURL) {
      const { list, active, isBreak } = await browser.storage.local.get();
      try {
        browser.tabs.sendMessage(tabId, {
          isBreak,
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
