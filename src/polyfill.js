// MV3 Chrome APIs are promise-based, so `chrome` already behaves like Firefox's `browser`.
if (typeof globalThis.browser === "undefined" && typeof globalThis.chrome !== "undefined") {
  globalThis.browser = globalThis.chrome;
}
