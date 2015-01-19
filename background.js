function getDomainFromUrl(url){
  var host = "null";
  if (typeof url == "undefined" || null == url)
    url = window.location.href;
  var regex = /.*\:\/\/([^\/]*).*/;
  var match = url.match(regex);
  if (typeof match != "undefined" && null != match)
    host = match[1];
  return host;
}

function checkForValidUrl(tabId, changeInfo, tab) {
  //if(getDomainFromUrl(tab.url).split('.').slice(-2).join('.').toLowerCase()=="hupu.com"){
  if(getDomainFromUrl(tab.url).toLowerCase()=="bbs.hupu.com"){
    chrome.pageAction.show(tabId);
    init();
  }
};

// Initialization.
function init() {
  if (localStorage.getItem('settings') === null) {
    localStorage.settings = JSON.stringify({
      'CC' : false, // Crab Catcher
      'HP' : false, // Hide Picture
      'BL' : false, // Black List
      'WR' : true  // Wangxu Radar
    });
  }
  if (localStorage.getItem('blacklist') === null) {
    localStorage.blacklist = JSON.stringify([]);
  }
}

chrome.tabs.onUpdated.addListener(checkForValidUrl);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.method == 'getSettings') {
    sendResponse({'settings':localStorage.settings});
  } else if (request.method == 'getBlacklist') {
    sendResponse({'blacklist':localStorage.blacklist});
  } else {
    sendResponse({});
  }
});
