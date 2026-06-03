(function() {
  'use strict';
  if (typeof self.browser !== 'undefined' && self.browser.runtime) return;
  if (typeof self.chrome === 'undefined') return;

  const c = self.chrome;

  function p(obj, method) {
    return function() {
      const args = Array.from(arguments);
      return new Promise(function(resolve, reject) {
        args.push(function() {
          if (c.runtime.lastError) {
            reject(new Error(c.runtime.lastError.message));
          } else {
            const results = Array.from(arguments);
            resolve(results.length <= 1 ? results[0] : results);
          }
        });
        obj[method].apply(obj, args);
      });
    };
  }

  const browser = {
    storage: {
      local: {
        get: p(c.storage.local, 'get'),
        set: p(c.storage.local, 'set')
      }
    },
    runtime: {
      sendMessage: p(c.runtime, 'sendMessage'),
      onMessage: c.runtime.onMessage
    },
    tabs: {
      update: p(c.tabs, 'update'),
      sendMessage: p(c.tabs, 'sendMessage')
    },
    webNavigation: {
      onBeforeNavigate: c.webNavigation.onBeforeNavigate
    }
  };

  if (c.declarativeNetRequest) {
    browser.declarativeNetRequest = {
      updateDynamicRules: p(c.declarativeNetRequest, 'updateDynamicRules')
    };
  }

  if (c.webRequest) {
    browser.webRequest = {
      onHeadersReceived: c.webRequest.onHeadersReceived
    };
  }

  self.browser = browser;
})();
