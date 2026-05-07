document.addEventListener('DOMContentLoaded', () => {
  const site1Input = document.getElementById('site1');
  const site2Input = document.getElementById('site2');
  const enabledCheckbox = document.getElementById('enabled');
  const saveBtn = document.getElementById('saveBtn');
  const btnText = document.getElementById('btnText');
  
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

  chrome.storage.local.get(['site1', 'site2', 'enabled'], (data) => {
    if (data.site1) site1Input.value = data.site1;
    if (data.site2) site2Input.value = data.site2;
    if (data.enabled !== undefined) enabledCheckbox.checked = data.enabled;
  });

  saveBtn.addEventListener('click', () => {
    let site1 = site1Input.value.trim();
    let site2 = site2Input.value.trim();
    let enabled = enabledCheckbox.checked;

    if (site1 && !site1.startsWith('http')) site1 = 'https://' + site1;
    if (site2 && !site2.startsWith('http')) site2 = 'https://' + site2;

    chrome.storage.local.set({ site1, site2, enabled }, () => {
      btnText.innerText = 'Сохранено!';
      
      setTimeout(() => {
        btnText.innerText = 'Сохранить изменения';
      }, 1500);

      chrome.runtime.sendMessage({ action: "updateRules", site1, site2, enabled });
    });
  });
});