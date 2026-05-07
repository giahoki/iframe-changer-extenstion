chrome.storage.local.get(['site1', 'site2', 'enabled'], (data) => {
  if (!data.enabled || !data.site1 || !data.site2) return;

  if (window.location.href.startsWith(data.site2)) {
    
    window.addEventListener('load', () => {
      document.documentElement.innerHTML = '';
      
      document.documentElement.style.margin = '0';
      document.documentElement.style.padding = '0';
      document.documentElement.style.width = '100%';
      document.documentElement.style.height = '100%';
      document.documentElement.style.overflow = 'hidden';
      // Можно поставить черный фон на время прогрузки фрейма, чтобы не было белой вспышки.
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
      // Убирает невидимый отступ под фреймом, который может вызвать прокрутку.
      iframe.style.display = 'block'; 
      
      iframe.sandbox = "allow-scripts allow-same-origin allow-forms allow-popups";
      
      body.appendChild(iframe);
      document.documentElement.appendChild(body);
    });
  }
});