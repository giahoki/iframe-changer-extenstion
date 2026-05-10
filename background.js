chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId !== 0 || details.tabId < 0) return;

  chrome.storage.local.get(['site1', 'site2', 'enabled'], (data) => {
    if (!data.enabled || !data.site1 || !data.site2) return;

    if (details.url.startsWith(data.site1)) {
       chrome.tabs.update(details.tabId, { url: data.site2 });
    }
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateRules") {
    const rules =[{
      "id": 1,
      "priority": 1,
      "action": {
        "type": "modifyHeaders",
        "responseHeaders":[
          { "header": "x-frame-options", "operation": "remove" },
          { "header": "content-security-policy", "operation": "remove" },
          { "header": "frame-options", "operation": "remove" }
        ]
      },
      "condition": { "resourceTypes": ["sub_frame"] }
    }];

    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1],
      addRules: message.enabled ? rules :[]
    });
  }

  if (message.action === "checkIfTargetTab" && sender.tab) {
    chrome.storage.local.get(['site2', 'enabled'], (data) => {
      const isTarget = !!(data.enabled && data.site2 && sender.tab.url && sender.tab.url.startsWith(data.site2));
      sendResponse({ isTarget });
    });
    return true; 
  }

  if (message.action === "iframeTitleChanged" && sender.tab) {
    chrome.storage.local.get(['site2', 'enabled'], (data) => {
      if (data.enabled && data.site2 && sender.tab.url && sender.tab.url.startsWith(data.site2)) {
        chrome.tabs.sendMessage(sender.tab.id, { action: "updateTitle", title: message.title }, { frameId: 0 }).catch(() => {});
      }
    });
  }
});