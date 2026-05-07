chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId !== 0) return;

  chrome.storage.local.get(['site1', 'site2', 'enabled'], (data) => {
    if (!data.enabled || !data.site1 || !data.site2) return;

    if (details.url.startsWith(data.site1)) {
       chrome.tabs.update(details.tabId, { url: data.site2 });
    }
  });
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "updateRules") {
    // Правила для заголовков теперь применяются к любому ресурсу, 
    // который загружается внутри iframe. Это нужно, чтобы сайт мог открыться.
    const rules = [{
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
      "condition": {
        "resourceTypes": ["sub_frame"]
      }
    }];

    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1],
      addRules: message.enabled ? rules : []
    });
  }
});