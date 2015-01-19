function getDomainFromUrl(url){
  var host = "null";
  if(typeof url == "undefined" || null == url)
    url = window.location.href;
  var regex = /.*\:\/\/([^\/]*).*/;
  var match = url.match(regex);
  if(typeof match != "undefined" && null != match)
    host = match[1];
  return host;
}

function checkForValidUrl(tabId, changeInfo, tab) {
  if(getDomainFromUrl(tab.url).split('.').slice(-2).join('.').toLowerCase()=="hupu.com"){
    chrome.pageAction.show(tabId);
    init();
  }
};

// Initialization.
function init() {
  if(localStorage.getItem('settings') === null) {
    localStorage.settings = JSON.stringify({
      'CC' : false,
      'HP' : false,
      'BL' : false,
      'WR' : true 
    });
  }
  if(localStorage.getItem('blacklist') === null) {
    localStorage.blacklist = JSON.stringify([]);
  }
}

chrome.tabs.onUpdated.addListener(checkForValidUrl);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.method == 'getSettings') {
    sendResponse({'settings':localStorage.settings});
  } else if(request.method == 'getBlacklist') {
    //sendResponse({'blacklist':localStorage.blacklist});
    console.log(localStorage.blacklist);
    sendResponse({'blacklist':localStorage.blacklist});
  } else {
    sendResponse({});
  }
});
