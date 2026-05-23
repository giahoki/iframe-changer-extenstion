const dict = {
  ru: {
    title: "Настройка<br>редиректов",
    subtitle: "Укажите сайты для показа контента и ссылку для перехода",
    site1Title: "Сайт 1",
    site1Sub: "Чей контент показываем",
    site2Title: "Сайт 2",
    site2Sub: "Какую ссылку показываем",
    toggleTitle: "Включить подмену",
    toggleSub: "Все переходы будут перенаправляться",
    btnText: "Сохранить изменения",
    saved: "Сохранено!",
    langBtn: "EN",
    customTitle: "Свой Title страницы",
    customTitlePlaceholder: "Будет браться из 1 ссылки",
    snowLabel: "Snow mode",
    snowSub: "Снегопад на фоне"
  },
  en: {
    title: "Redirect<br>Settings",
    subtitle: "Specify the sites to show content and the redirect link",
    site1Title: "Site 1",
    site1Sub: "Whose content we show",
    site2Title: "Site 2",
    site2Sub: "Which link we show",
    toggleTitle: "Enable spoofing",
    toggleSub: "All transitions will be redirected",
    btnText: "Save changes",
    saved: "Saved!",
    langBtn: "RU",
    customTitle: "Custom Page Title",
    customTitlePlaceholder: "Will be taken from Site 1",
    snowLabel: "Snow mode",
    snowSub: "Snowfall on background"
  }
};

const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
let currentLang = browserLang.startsWith('ru') ? 'ru' : 'en';

function applyLang() {
  document.getElementById('t-title').innerHTML = dict[currentLang].title;
  document.getElementById('t-subtitle').innerText = dict[currentLang].subtitle;
  document.getElementById('t-site1Title').innerText = dict[currentLang].site1Title;
  document.getElementById('t-site1Sub').innerText = dict[currentLang].site1Sub;
  document.getElementById('t-site2Title').innerText = dict[currentLang].site2Title;
  document.getElementById('t-site2Sub').innerText = dict[currentLang].site2Sub;
  document.getElementById('t-toggleTitle').innerText = dict[currentLang].toggleTitle;
  document.getElementById('t-toggleSub').innerText = dict[currentLang].toggleSub;
  document.getElementById('btnText').innerText = dict[currentLang].btnText;
  document.getElementById('langBtn').innerText = dict[currentLang].langBtn;
  document.getElementById('t-customTitleText').innerText = dict[currentLang].customTitle;
  document.getElementById('customTitle').placeholder = dict[currentLang].customTitlePlaceholder;
  document.getElementById('t-snowLabel').innerText = dict[currentLang].snowLabel;
  document.getElementById('t-snowSub').innerText = dict[currentLang].snowSub;
}

let snowAnimationId = null;
let snowflakes = [];
let snowEnabled = false;

function initSnow(canvas) {
  const ctx = canvas.getContext('2d');
  const count = 80;
  snowflakes = [];
  for (let i = 0; i < count; i++) {
    snowflakes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 3 + 1,
      speed: Math.random() * 1 + 0.5,
      wind: Math.random() * 0.5 - 0.25,
      opacity: Math.random() * 0.5 + 0.3
    });
  }
  return ctx;
}

function startSnow(canvas) {
  if (snowAnimationId) return;
  const ctx = initSnow(canvas);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255,255,255,0.9)';

    for (const s of snowflakes) {
      s.y += s.speed;
      s.x += s.wind;
      if (s.y > canvas.height) { s.y = -s.r; s.x = Math.random() * canvas.width; }
      if (s.x > canvas.width) s.x = -s.r;
      if (s.x < -s.r) s.x = canvas.width;

      ctx.globalAlpha = s.opacity;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    snowAnimationId = requestAnimationFrame(animate);
  }
  animate();
}

function stopSnow() {
  if (snowAnimationId) {
    cancelAnimationFrame(snowAnimationId);
    snowAnimationId = null;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const site1Input = document.getElementById('site1');
  const site2Input = document.getElementById('site2');
  const customTitleInput = document.getElementById('customTitle');
  const enabledCheckbox = document.getElementById('enabled');
  const saveBtn = document.getElementById('saveBtn');
  const btnText = document.getElementById('btnText');
  const langBtn = document.getElementById('langBtn');
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsPanel = document.getElementById('settingsPanel');
  const snowToggle = document.getElementById('snowToggle');
  const snowCanvas = document.getElementById('snowCanvas');

  function updateCanvasSize() {
    snowCanvas.width = window.innerWidth;
    snowCanvas.height = window.innerHeight;
  }
  updateCanvasSize();
  window.addEventListener('resize', updateCanvasSize);

  const body = document.body;
  const blobs = document.querySelectorAll('.blob');

  body.addEventListener('mousemove', (event) => {
    if (snowEnabled) return;
    const { clientX, clientY } = event;
    body.style.background = `radial-gradient(600px circle at ${clientX}px ${clientY}px, #ffffff 0%, #1a1a1a 40%, #050505 70%)`;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const moveX = (clientX - centerX);
    const moveY = (clientY - centerY);
    blobs[0].style.transform = `translate(${moveX * 0.05}px, ${moveY * 0.05}px)`;
    blobs[1].style.transform = `translate(${moveX * -0.03}px, ${moveY * -0.03}px)`;
  });

  function applySnowMode(enabled) {
    snowEnabled = enabled;
    if (enabled) {
      body.style.background = 'radial-gradient(600px circle at 380px 270px, #ffffff 0%, #1a1a1a 40%, #050505 70%)';
      blobs[0].style.transform = '';
      blobs[1].style.transform = '';
      startSnow(snowCanvas);
    } else {
      stopSnow();
      const ctx = snowCanvas.getContext('2d');
      ctx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
    }
  }

  browser.storage.local.get(['site1', 'site2', 'enabled', 'lang', 'customTitle', 'snowMode']).then((data) => {
    if (data.site1) site1Input.value = data.site1;
    if (data.site2) site2Input.value = data.site2;
    if (data.customTitle) customTitleInput.value = data.customTitle;
    if (data.enabled !== undefined) enabledCheckbox.checked = data.enabled;
    if (data.lang) currentLang = data.lang;
    if (data.snowMode) {
      snowToggle.checked = true;
      applySnowMode(true);
    }
    applyLang();
  });

  langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'ru' ? 'en' : 'ru';
    browser.storage.local.set({ lang: currentLang });
    applyLang();
  });

  settingsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    settingsPanel.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!settingsPanel.contains(e.target) && e.target !== settingsBtn) {
      settingsPanel.classList.remove('open');
    }
  });

  snowToggle.addEventListener('change', () => {
    const enabled = snowToggle.checked;
    browser.storage.local.set({ snowMode: enabled });
    applySnowMode(enabled);
  });

  saveBtn.addEventListener('click', () => {
    let site1 = site1Input.value.trim();
    let site2 = site2Input.value.trim();
    let customTitle = customTitleInput.value.trim();
    let enabled = enabledCheckbox.checked;

    if (site1 && !site1.startsWith('http')) site1 = 'https://' + site1;
    if (site2 && !site2.startsWith('http')) site2 = 'https://' + site2;

    browser.storage.local.set({ site1, site2, enabled, customTitle }).then(() => {
      btnText.innerText = dict[currentLang].saved;

      setTimeout(() => {
        btnText.innerText = dict[currentLang].btnText;
      }, 1500);

      browser.runtime.sendMessage({ action: "updateRules", site1, site2, enabled }).catch(() => {});
    });
  });
});
