import 'libs/polyfills';
import browser from 'webextension-polyfill';
import { baseURLRegex } from 'constants/regex';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

let intervalID;
let remainingTime;

browser.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  const tabs = await browser.tabs.query({ currentWindow: true, active: true });
  if (request.greeting === 'showOptionsPage') {
    browser.runtime.openOptionsPage();
  }
  if (request.type == 'closeTab') {
  }

  if (request.command === 'start-timer') {
    const countdown = minutes => {
      const now = new Date().getTime();

      const target = new Date(now + minutes * 1000 * 60 + 500);

      intervalID = setInterval(function() {
        const now = new Date();

        const remaining = (target - now) / 1000;

        remainingTime = remaining;

        if (remaining < 0) {
          const tabId = tabs[0].id;

          browser.tabs.sendMessage(tabId, {
            command: 'resume-focus-mode',
            shouldActive: true,
          });

          browser.browserAction.setBadgeText({ text: '' });
          clearInterval(intervalID);
        }

        const minutes = ~~(remaining / 60);
        const seconds = ~~(remaining % 60);

        const timeLeft = `${minutes}:${('00' + seconds).slice(-2)}`;

        if (remaining <= 0) {
          browser.browserAction.setBadgeText({ text: '' });
        } else {
          browser.browserAction.setBadgeText({ text: timeLeft });
          browser.browserAction.setBadgeBackgroundColor({ color: '#374862' });
        }
      }, 100);
    };

    countdown(request.interval);
  }

  if (request.command === 'reset-timer') {
    clearInterval(intervalID);
    browser.browserAction.setBadgeText({ text: '' });
  }

  if (request.command === 'get-time') {
    sendResponse({ time: remainingTime });
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
