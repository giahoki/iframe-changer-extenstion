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
    customTitlePlaceholder: "Будет браться из 1 ссылки"
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
    customTitlePlaceholder: "Will be taken from Site 1"
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
}

document.addEventListener('DOMContentLoaded', () => {
  const site1Input = document.getElementById('site1');
  const site2Input = document.getElementById('site2');
  const customTitleInput = document.getElementById('customTitle');
  const enabledCheckbox = document.getElementById('enabled');
  const saveBtn = document.getElementById('saveBtn');
  const btnText = document.getElementById('btnText');
  const langBtn = document.getElementById('langBtn');
  
  const body = document.body;
  const blobs = document.querySelectorAll('.blob');
  
  body.addEventListener('mousemove', (event) => {
    const { clientX, clientY } = event;
    body.style.background = `radial-gradient(600px circle at ${clientX}px ${clientY}px, #ffffff 0%, #1a1a1a 40%, #050505 70%)`;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const moveX = (clientX - centerX);
    const moveY = (clientY - centerY);
    blobs[0].style.transform = `translate(${moveX * 0.05}px, ${moveY * 0.05}px)`;
    blobs[1].style.transform = `translate(${moveX * -0.03}px, ${moveY * -0.03}px)`;
  });

  chrome.storage.local.get(['site1', 'site2', 'enabled', 'lang', 'customTitle'], (data) => {
    if (data.site1) site1Input.value = data.site1;
    if (data.site2) site2Input.value = data.site2;
    if (data.customTitle) customTitleInput.value = data.customTitle;
    if (data.enabled !== undefined) enabledCheckbox.checked = data.enabled;
    
    if (data.lang) {
      currentLang = data.lang;
    }
    
    applyLang();
  });

  langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'ru' ? 'en' : 'ru';
    chrome.storage.local.set({ lang: currentLang });
    applyLang();
  });

  saveBtn.addEventListener('click', () => {
    let site1 = site1Input.value.trim();
    let site2 = site2Input.value.trim();
    let customTitle = customTitleInput.value.trim();
    let enabled = enabledCheckbox.checked;

    if (site1 && !site1.startsWith('http')) site1 = 'https://' + site1;
    if (site2 && !site2.startsWith('http')) site2 = 'https://' + site2;

    chrome.storage.local.set({ site1, site2, enabled, customTitle }, () => {
      btnText.innerText = dict[currentLang].saved;
      
      setTimeout(() => {
        btnText.innerText = dict[currentLang].btnText;
      }, 1500);

      chrome.runtime.sendMessage({ action: "updateRules", site1, site2, enabled });
    });
  });
});