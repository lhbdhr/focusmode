import 'libs/polyfills';
import browser from 'webextension-polyfill';

browser.runtime.onMessage.addListener(async msg => {
  if (msg.greeting === 'showOptionsPage') {
    browser.runtime.openOptionsPage();
  }
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.tabs.get(activeInfo.tabId, async function(tab) {
    const url = tab.url;

    // const all = await browser.storage.sync.get();

    // alert(JSON.stringify({ ...all }, null, 2));
    // if (url) {
    //   const { list } = await browser.storage.sync.get();
    //   const hostname = new URL(url).host;
    //   const blockedHostname = list.map(({ url }) => url);
    //   const isBlocked = blockedHostname.includes(hostname);
    //   if (isBlocked) {
    //     browser.tabs.sendMessage(activeInfo.tabId, {
    //       message: hostname,
    //       tabId: activeInfo.tabId,
    //       url: url,
    //     });
    //   }
    // }
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
