function onPageUpdate(tabID, changeInfo, tab) {
  getURL(tabID, changeInfo, tab);  
  addIconToOmnibar(tabID, changeInfo, tab);
}


function getURL(tabID, changeInfo, tab){
  var url = tab.url;
  var begin;
  if(url.lastIndexOf("#q=") !== -1) {
    var begin = url.lastIndexOf("#q=");
  } else {
    var begin = url.lastIndexOf("?q=");
  }
  var url_length = url.length;
  url = url.substring(begin +3, url_length);
  if (url.indexOf("&") < url.length) {
    var end = url.indexOf("&");
  } else {
    var end = url.length;
  }; 
  searchQuery = url.substring(0, end);
	}; 

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) { 
    if(request === "getURL") {   
      sendResponse(searchQuery);
  }
  });

function addIconToOmnibar(tabID, changeInfo, tab) {
    var url = tab.url;
    if (url.indexOf("google.") !== -1) {
    chrome.pageAction.show(tab.id);
  };
}

chrome.tabs.onUpdated.addListener(onPageUpdate);
chrome.tabs.onHighlighted.addListener(onPageUpdate);
chrome.webNavigation.onHistoryStateUpdated.addListener(onPageUpdate);