browser.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId !== 0 || details.tabId < 0) return;

  browser.storage.local.get(['site1', 'site2', 'enabled']).then((data) => {
    if (!data.enabled || !data.site1 || !data.site2) return;

    if (details.url.startsWith(data.site1)) {
      browser.tabs.update(details.tabId, { url: data.site2 });
    }
  });
});

const headersToRemove = [
  "x-frame-options",
  "content-security-policy",
  "frame-options"
];

browser.webRequest.onHeadersReceived.addListener(
  (details) => {
    return {
      responseHeaders: details.responseHeaders.filter(header => 
        !headersToRemove.includes(header.name.toLowerCase())
      )
    };
  },
  { urls: ["<all_urls>"], types: ["sub_frame"] },
  ["blocking", "responseHeaders"]
);

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "checkIfTargetTab" && sender.tab) {
    browser.storage.local.get(['site2', 'enabled']).then((data) => {
      const isTarget = !!(data.enabled && data.site2 && sender.tab.url && sender.tab.url.startsWith(data.site2));
      sendResponse({ isTarget });
    });
    return true; 
  }

  if (message.action === "iframeTitleChanged" && sender.tab) {
    browser.storage.local.get(['site2', 'enabled']).then((data) => {
      if (data.enabled && data.site2 && sender.tab.url && sender.tab.url.startsWith(data.site2)) {
        browser.tabs.sendMessage(sender.tab.id, { action: "updateTitle", title: message.title }, { frameId: 0 }).catch(() => {});
      }
    });
  }
});
