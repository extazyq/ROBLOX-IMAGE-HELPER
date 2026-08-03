document.addEventListener('DOMContentLoaded', function() {
  
  document.getElementById('reloadImages').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "reloadImages"});
    });
  });
  
  document.getElementById('clearCache').addEventListener('click', function() {
    if (confirm('Очистить кэш изображений Roblox?')) {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "clearCache"});
      });
    }
  });
  
  updateStats();
});

function updateStats() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "getImageCount"}, function(response) {
      if (response && response.count) {
        document.getElementById('imgCount').textContent = response.count;
      }
    });
  });
}