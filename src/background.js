// Chrome loads this as a service worker (no manifest `scripts`), Firefox as an event page.
if (typeof importScripts === "function" && typeof globalThis.browser === "undefined") {
  importScripts("polyfill.js");
}

const REDIRECT_RULE_ID = 1;
const HEADERS_RULE_ID = 2;
const HEADERS_TO_REMOVE = ["x-frame-options", "content-security-policy", "frame-options"];

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function hostOf(url) {
  try { return new URL(url).hostname; } catch { return null; }
}

function buildRules({ site1, site2, enabled }) {
  if (!enabled || !site1 || !site2) return [];
  const rules = [];
  const site1Host = hostOf(site1);
  const site2Host = hostOf(site2);

  // Navigating to Site 1 lands on Site 2 (which then frames Site 1 via content.js).
  rules.push({
    id: REDIRECT_RULE_ID,
    priority: 1,
    action: { type: "redirect", redirect: { url: site2 } },
    condition: {
      regexFilter: "^" + escapeRegex(site1),
      resourceTypes: ["main_frame"],
    },
  });

  // Let Site 1 be framed — only inside Site 2, nowhere else.
  const condition = { resourceTypes: ["sub_frame"] };
  if (site1Host) condition.requestDomains = [site1Host];
  if (site2Host) condition.initiatorDomains = [site2Host];
  rules.push({
    id: HEADERS_RULE_ID,
    priority: 1,
    action: {
      type: "modifyHeaders",
      responseHeaders: HEADERS_TO_REMOVE.map((header) => ({ header, operation: "remove" })),
    },
    condition,
  });

  return rules;
}

async function syncRules() {
  const data = await browser.storage.local.get(["site1", "site2", "enabled"]);
  const existing = await browser.declarativeNetRequest.getDynamicRules();
  await browser.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existing.map((r) => r.id),
    addRules: buildRules(data),
  });
}

browser.runtime.onInstalled.addListener(() => { syncRules().catch(console.error); });
browser.runtime.onStartup.addListener(() => { syncRules().catch(console.error); });

browser.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;
  if ("site1" in changes || "site2" in changes || "enabled" in changes) {
    syncRules().catch(console.error);
  }
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateRules") {
    syncRules().then(() => sendResponse({ ok: true }), (e) => sendResponse({ ok: false, error: String(e) }));
    return true;
  }

  if (message.action === "checkIfTargetTab" && sender.tab) {
    browser.storage.local.get(["site2", "enabled"]).then((data) => {
      const isTarget = !!(data.enabled && data.site2 && sender.tab.url && sender.tab.url.startsWith(data.site2));
      sendResponse({ isTarget });
    });
    return true;
  }

  if (message.action === "iframeTitleChanged" && sender.tab) {
    browser.storage.local.get(["site2", "enabled"]).then((data) => {
      if (data.enabled && data.site2 && sender.tab.url && sender.tab.url.startsWith(data.site2)) {
        browser.tabs.sendMessage(sender.tab.id, { action: "updateTitle", title: message.title }, { frameId: 0 }).catch(() => {});
      }
    });
  }
});
