console.log('🎮 Roblox Helper активен');

function reloadImages() {
  const images = document.querySelectorAll('img');
  let count = 0;
  
  images.forEach(img => {
    if (img.src && img.src.includes('roblox')) {
      const src = img.src;
      img.src = '';
      setTimeout(() => {
        img.src = src;
      }, 100);
      count++;
    }
  });
  
  showNotification('🔄 Перезагружено ' + count + ' изображений');
}

function clearImageCache() {
  const images = document.querySelectorAll('img[src*="roblox"]');
  images.forEach(img => {
    const src = img.src.split('?')[0];
    img.src = src + '?t=' + Date.now();
  });
  
  showNotification('🗑️ Кэш очищен');
}

function getImageCount() {
  return document.querySelectorAll('img[src*="roblox"]').length;
}

function showNotification(text) {
  const old = document.getElementById('roblox-helper-notify');
  if (old) old.remove();
  
  const div = document.createElement('div');
  div.id = 'roblox-helper-notify';
  div.textContent = text;
  div.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 999999;
    background: rgba(0,0,0,0.85);
    color: white;
    padding: 10px 20px;
    border-radius: 10px;
    font-size: 13px;
    border: 1px solid #ff6b35;
    box-shadow: 0 4px 30px rgba(0,0,0,0.5);
    animation: fadeInUp 0.3s ease;
  `;
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateX(-50%) translateY(20px); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(div);
  
  setTimeout(() => {
    div.style.opacity = '0';
    div.style.transition = 'opacity 0.5s';
    setTimeout(() => div.remove(), 500);
  }, 2500);
}

function addRobloxLogo() {
  const old = document.getElementById('roblox-helper-logo');
  if (old) old.remove();
  
  const container = document.createElement('div');
  container.id = 'roblox-helper-logo';
  container.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 999999;
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(0,0,0,0.7);
    padding: 8px 14px;
    border-radius: 10px;
    border: 1px solid rgba(255,107,53,0.3);
    backdrop-filter: blur(10px);
    cursor: pointer;
    transition: all 0.3s;
  `;
  
  container.onmouseover = () => {
    container.style.transform = 'scale(1.05)';
    container.style.borderColor = '#ff6b35';
  };
  container.onmouseout = () => {
    container.style.transform = 'scale(1)';
    container.style.borderColor = 'rgba(255,107,53,0.3)';
  };
  
  const img = document.createElement('img');
  img.src = 'https://www.roblox.com/assets/img/favicon.ico';
  img.style.cssText = `
    width: 24px;
    height: 24px;
    border-radius: 5px;
    background: white;
    padding: 2px;
  `;
  container.appendChild(img);
  
  const text = document.createElement('span');
  text.textContent = '⚡ Roblox Helper';
  text.style.cssText = `
    color: white;
    font-size: 11px;
    font-weight: bold;
  `;
  container.appendChild(text);
  
  container.onclick = () => {
    reloadImages();
  };
  
  document.body.appendChild(container);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "reloadImages") {
    reloadImages();
    sendResponse({ status: 'ok' });
  }
  
  if (request.action === "clearCache") {
    clearImageCache();
    sendResponse({ status: 'ok' });
  }
  
  if (request.action === "getImageCount") {
    sendResponse({ count: getImageCount() });
  }
  
  return true;
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    addRobloxLogo();
  });
} else {
  addRobloxLogo();
}

const observer = new MutationObserver(() => {
  if (!document.getElementById('roblox-helper-logo')) {
    addRobloxLogo();
  }
});
observer.observe(document.body, { childList: true, subtree: true });