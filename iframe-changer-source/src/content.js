browser.storage.local.get(['site1', 'site2', 'enabled', 'customTitle']).then((data) => {
  if (!data.enabled || !data.site1 || !data.site2) return;

  const isMainPage = window.location.href.startsWith(data.site2) && window === window.top;
  const isIframe = window !== window.top;

  if (isMainPage) {
    document.title = data.customTitle ? data.customTitle : '\u200B';

    browser.runtime.onMessage.addListener((message) => {
      if (message.action === "updateTitle" && message.title && !data.customTitle) {
        document.title = message.title;
      }
    });

    const initReplacement = () => {
      const currentTitle = document.title;
      document.documentElement.innerHTML = '';

      const head = document.createElement('head');
      const titleEl = document.createElement('title');
      titleEl.textContent = currentTitle;
      head.appendChild(titleEl);
      document.documentElement.appendChild(head);

      document.documentElement.style.margin = '0';
      document.documentElement.style.padding = '0';
      document.documentElement.style.width = '100%';
      document.documentElement.style.height = '100%';
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.backgroundColor = '#000000';

      const body = document.createElement('body');
      body.style.margin = '0';
      body.style.padding = '0';
      body.style.width = '100%';
      body.style.height = '100%';
      body.style.overflow = 'hidden';

      const iframe = document.createElement('iframe');
      iframe.src = data.site1;

      iframe.style.position = 'fixed';
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.style.margin = '0';
      iframe.style.padding = '0';
      iframe.style.display = 'block';

      iframe.sandbox = "allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads allow-popups-to-escape-sandbox";

      body.appendChild(iframe);
      document.documentElement.appendChild(body);
    };

    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', initReplacement);
    } else {
      initReplacement();
    }
  }

  if (isIframe) {
    browser.runtime.sendMessage({ action: "checkIfTargetTab" }).then((response) => {
      if (response && response.isTarget && !data.customTitle) {
        let lastTitle = "";

        const sendTitle = () => {
          const currentTitle = document.title || document.querySelector('title')?.innerText || "";
          if (currentTitle && currentTitle !== lastTitle) {
            lastTitle = currentTitle;
            browser.runtime.sendMessage({ action: "iframeTitleChanged", title: currentTitle });
          }
        };

        sendTitle();
        window.addEventListener('DOMContentLoaded', sendTitle);
        window.addEventListener('load', sendTitle);

        const observer = new MutationObserver(sendTitle);
        const startObserving = () => {
          const titleEl = document.querySelector('title');
          if (titleEl) {
            observer.observe(titleEl, { childList: true, characterData: true, subtree: true });
          } else if (document.head) {
            observer.observe(document.head, { childList: true, subtree: true });
          } else {
            setTimeout(startObserving, 100);
          }
        };
        startObserving();
      }
    });
  }
});
