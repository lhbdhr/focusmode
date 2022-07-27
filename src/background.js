import 'libs/polyfills';
import browser from 'webextension-polyfill';
import { baseURLRegex } from 'constants/regex';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

// TODO: fix issue when close laptop when timer is ticking

dayjs.extend(duration);

let intervalID;
let targetEnd;

const isValidURL = url => {
  if (url) {
    return url.indexOf('http://') == 0 || url.indexOf('https://') == 0;
  }
};

const init = async () => {
  const { list, active, isBreak, target } = await browser.storage.local.get();
  const now = new Date();
  const isAfterNow = dayjs(target).isAfter(dayjs(now));

  if (intervalID && isAfterNow && isBreak && active) {
    clearInterval(intervalID);

    intervalID = setInterval(async function() {
      const isAfterNow = dayjs(target).isAfter(dayjs(now));
      const now = new Date();

      const remaining = (new Date(target) - now) / 1000;

      const minutes = ~~(remaining / 60);
      const seconds = ~~(remaining % 60);

      const timeLeft = `${minutes}:${('00' + seconds).slice(-2)}`;

      if (remaining < (0.0).toPrecision(6) && !isAfterNow) {
        clearInterval(intervalID);

        const tabs = await browser.tabs.query({ currentWindow: true });

        if (tabs.length > 0) {
          tabs.forEach(({ url, id }) => {
            const [baseURL] = url.match(baseURLRegex) ?? [];

            const pausedURL = list.map(({ url }) => {
              const [baseURL] = url.match(baseURLRegex);
              return baseURL;
            });

            if (pausedURL.includes(baseURL)) {
              browser.tabs.sendMessage(id, {
                isBreak: false,
                id: 'onBreak',
              });
            }
          });
        }

        browser.storage.local.set({ isBreak: false });
        browser.browserAction.setBadgeText({ text: '' });
      } else {
        browser.browserAction.setBadgeText({ text: timeLeft });
        browser.browserAction.setBadgeBackgroundColor({ color: '#374862' });
      }
    }, 100);

    // browser.storage.local.set({ isBreak: false });

    // browser.tabs.sendMessage(tabId, {
    //   isBreak: false,
    //   active,
    //   list,
    //   target,
    //   id: 'fromBackground',
    // });
  } else {
    browser.browserAction.setBadgeText({ text: '' });
  }
};

// init();

// browser.runtime.onStartup;

// browser.windows.onFocusChanged.addListener(async () => {
//   const { list, active, isBreak, target } = await browser.storage.local.get();

//   const isAfterNow = dayjs(target).isAfter(dayjs());

//   console.log('isAfterNow->', isAfterNow);
//   console.log('intervalID->', intervalID);
//   console.log('targetEnd->', targetEnd);
//   console.log('target->', target);
//   if (!!target && isAfterNow && !intervalID && isBreak && active) {
//     console.log('heehehehe');

//     // clearInterval(intervalID);

//     intervalID = setInterval(async function() {
//       const now = new Date();

//       const remaining = (new Date(target) - now) / 1000;

//       const minutes = ~~(remaining / 60);
//       const seconds = ~~(remaining % 60);

//       const timeLeft = `${minutes}:${('00' + seconds).slice(-2)}`;

//       console.log({ remaining });

//       const isAfterNow2 = dayjs(target).isAfter(dayjs());

//       if (remaining < (0.0).toPrecision(6) && !isAfterNow2) {
//         console.log('yo stop it');
//         clearInterval(intervalID);

//         const tabs = await browser.tabs.query({ currentWindow: true });

//         if (tabs.length > 0) {
//           tabs.forEach(({ url, id }) => {
//             const [baseURL] = url.match(baseURLRegex) ?? [];

//             const pausedURL = list.map(({ url }) => {
//               const [baseURL] = url.match(baseURLRegex);
//               return baseURL;
//             });

//             if (pausedURL.includes(baseURL)) {
//               browser.tabs.sendMessage(id, {
//                 isBreak: false,
//                 id: 'onBreak',
//               });
//             }
//           });
//         }

//         browser.storage.local.set({ isBreak: false, target: null });
//         browser.browserAction.setBadgeText({ text: '' });
//       } else {
//         browser.browserAction.setBadgeText({ text: timeLeft });
//         browser.browserAction.setBadgeBackgroundColor({ color: '#374862' });
//       }
//     }, 100);
//   }
// });

chrome.idle.onStateChanged.addListener(async state => {
  if (state === 'active') {
    const { list, active, isBreak, target } = await browser.storage.local.get();

    const isAfterNow = dayjs(target).isAfter(dayjs());

    console.log('isAfterNow->', isAfterNow);
    console.log('intervalID->', intervalID);
    console.log('targetEnd->', targetEnd);
    console.log('target->', target);

    if (!!target && isAfterNow && !intervalID && isBreak && active) {
      console.log('heehehehe');

      // clearInterval(intervalID);

      intervalID = setInterval(async function() {
        const now = new Date();

        const remaining = (new Date(target) - now) / 1000;

        const minutes = ~~(remaining / 60);
        const seconds = ~~(remaining % 60);

        const timeLeft = `${minutes}:${('00' + seconds).slice(-2)}`;

        console.log({ remaining });

        const isAfterNow2 = dayjs(target).isAfter(dayjs());

        if (remaining < (0.0).toPrecision(6) && !isAfterNow2) {
          console.log('yo stop it');
          clearInterval(intervalID);

          const tabs = await browser.tabs.query({ currentWindow: true });

          if (tabs.length > 0) {
            tabs.forEach(async ({ url, id }) => {
              const [baseURL] = url.match(baseURLRegex) ?? [];

              const pausedURL = list.map(({ url }) => {
                const [baseURL] = url.match(baseURLRegex);
                return baseURL;
              });

              console.log({ pausedURL });

              if (pausedURL.includes(baseURL)) {
                await browser.tabs.sendMessage(id, {
                  isBreak: false,
                  id: 'onBreak',
                });
              }
            });
          }
          console.log({ tabs });

          browser.storage.local.set({ isBreak: false, target: null });
          browser.browserAction.setBadgeText({ text: '' });
        } else {
          browser.browserAction.setBadgeText({ text: timeLeft });
          browser.browserAction.setBadgeBackgroundColor({ color: '#374862' });
        }
      }, 100);
    }
  }
});

browser.runtime.onMessage.addListener(async (request, sender) => {
  try {
    const { list } = await browser.storage.local.get();

    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const isDarkMode = window.matchMedia && media.matches;

    if (request.greeting === 'showOptionsPage') {
      browser.runtime.openOptionsPage();
    }
    if (request.type == 'closeTab') {
      browser.tabs.remove(sender.tab.id);
    }

    if (request.type == 'onBreak') {
      const now = new Date();

      const target = new Date(now.getTime() + request.interval * 1000 * 60 + 1000).toISOString();
      targetEnd = target;

      const countdown = async () => {
        try {
          intervalID = setInterval(async function() {
            const isAfterNow = dayjs(target).isAfter(dayjs(now));
            const now = new Date();

            const remaining = (new Date(target) - now) / 1000;

            const minutes = ~~(remaining / 60);
            const seconds = ~~(remaining % 60);

            const timeLeft = `${minutes}:${('00' + seconds).slice(-2)}`;

            if (remaining < (0.0).toPrecision(6) && !isAfterNow) {
              clearInterval(intervalID);

              const tabs = await browser.tabs.query({ currentWindow: true });

              if (tabs.length > 0) {
                tabs.forEach(({ url, id }) => {
                  const [baseURL] = url.match(baseURLRegex) ?? [];

                  const pausedURL = list.map(({ url }) => {
                    const [baseURL] = url.match(baseURLRegex);
                    return baseURL;
                  });

                  if (pausedURL.includes(baseURL)) {
                    browser.tabs.sendMessage(id, {
                      isBreak: false,
                      id: 'onBreak',
                    });
                  }
                });
              }

              browser.storage.local.set({ isBreak: false });

              browser.browserAction.setBadgeText({ text: '' });
            } else {
              browser.browserAction.setBadgeText({ text: timeLeft });
              browser.browserAction.setBadgeBackgroundColor({ color: '#374862' });
            }
          }, 100);
        } catch (e) {
          clearInterval(intervalID);
        }
      };
      if (target) {
        // browser.storage.local.set({ targetEnd });
        countdown();
      }

      return Promise.resolve(target);
    }

    if (request.command == 'get-time') {
      return Promise.resolve({ target: targetEnd });
    }

    if (request.type == 'onResume') {
      targetEnd = null;
      // const { target } = await browser.storage.local.get();

      clearInterval(intervalID);
      browser.browserAction.setBadgeText({ text: '' });

      if (isDarkMode) {
        return browser.browserAction.setIcon({ path: './assets/img/circle-dark-mode.png' });
      }
      return browser.browserAction.setIcon({ path: './assets/img/circle.png' });
    }
  } catch (error) {
    return Promise.resolve('');
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

  if (tabs.length > 0 && !!tabs[0].url && isValidURL(tabs[0].url)) {
    const [baseURL] = tabs[0].url.match(baseURLRegex) ?? [];

    const tabId = tabs[0].id;
    if (baseURL) {
      const { list, active, isBreak, target } = await browser.storage.local.get();
      try {
        browser.tabs.sendMessage(tabId, {
          isBreak,
          active,
          list,
          target,
          id: 'fromBackground',
        });
      } catch {
        return false;
      }
    }
  }
});

browser.tabs.onActivated.addListener(async function(activeInfo) {
  const tabs = await browser.tabs.query({ currentWindow: true, active: true });
  const [baseURL] = tabs[0].url.match(baseURLRegex) ?? [];

  if (baseURL && tabs.length > 0 && !!tabs[0].url && isValidURL(tabs[0].url)) {
    const { list, active, isBreak, target } = await browser.storage.local.get();

    try {
      browser.tabs.sendMessage(activeInfo.tabId, {
        isBreak,
        active,
        list,
        target,
        id: 'fromBackground',
        tabId: activeInfo.tabId,
      });
      return true;
    } catch (err) {
      return false;
    }
  }
});

browser.tabs.onUpdated.addListener(async (tabId, change, tab) => {
  if (tab.active && change.url && isValidURL(change.url)) {
    const [baseURL] = change.url.match(baseURLRegex) ?? [];
    if (baseURL) {
      const { list, active, isBreak, target } = await browser.storage.local.get();
      try {
        browser.tabs.sendMessage(tabId, {
          isBreak,
          active,
          list,
          target,
          id: 'fromBackground',
        });
      } catch (error) {
        return false;
      }
    }
  }
});
