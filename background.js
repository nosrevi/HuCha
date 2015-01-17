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
  if(typeof localStorage.settings == 'undefined') {
    localStorage.settings = JSON.stringify({
      'CC' : false,
      'HP' : false,
      'BL' : false,
      'WR' : true 
    });
  }
  if(typeof localStorage.blackList == 'undefined') {
    localStorage.blackList = JSON.stringify([]);
  }
}

chrome.tabs.onUpdated.addListener(checkForValidUrl);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.method == 'getSettings') {
    sendResponse({'settings':localStorage.settings});
  } else if(request.method == 'getBlackList') {
    //sendResponse({'blackList':localStorage.blackList});
    sendResponse({'blackList':JSON.stringify(['无神过往','casablancangel'])});
  } else {
    sendResponse({});
  }
});
