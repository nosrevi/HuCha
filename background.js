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

chrome.tabs.onUpdated.addListener(checkForValidUrl);

// Initialization.
function init() {
  if (localStorage["filters"] == undefined) {
    setFilters(defaultFilters);
  } else {
    allFilters = JSON.parse(localStorage["filters"]);
  }
}
