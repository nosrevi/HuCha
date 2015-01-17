allFilters = null;

function setFilters(newFilters) {
  allFilters = newFilters;
  localStorage["filters"] = JSON.stringify(newFilters);
}

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

//var settings = JSON.stringify({'CC':true, 'HP':true, 'BL':false, 'WR':false});
//localStorage['settings'] = '1';
if (typeof localStorage.settings == 'undefined') {
  localStorage.settings = JSON.stringify({
    'CC' : false,
    'HP' : false,
    'BL' : false,
    'WR' : true 
  });
}
//chrome.storage.local.set({'settings': settings});
chrome.tabs.onUpdated.addListener(checkForValidUrl);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.method == 'getSettings') {
      console.log('gs'+localStorage.settings);
      sendResponse({'settings':localStorage.settings});
//    chrome.storage.local.get('settings', function(response) {
//      var res = response.settings;
//      console.log(res);
//      sendResponse({n: '1'});
//    });
  } else {
      console.log('el'+localStorage.settings);
    sendResponse({});
  }
});

// Initialization.
function init() {
  if (localStorage["filters"] == undefined) {
    setFilters(defaultFilters);
  } else {
    allFilters = JSON.parse(localStorage["filters"]);
  }
}
