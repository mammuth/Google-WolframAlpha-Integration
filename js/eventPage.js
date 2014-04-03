function onPageUpdate(tabID, changeInfo, tab) {
  getURL(tabID, changeInfo, tab);  
  addIconToOmnibar(tabID, changeInfo, tab);
}

function getURL(tabID, changeInfo, tab){
  var url = tab.url;
  var begin;
  var end;
  if(url.lastIndexOf("#q=") !== -1) {
    begin = url.lastIndexOf("#q=");
  } else {
    begin = url.lastIndexOf("?q=");
  }
  var url_length = url.length;
  url = url.substring(begin +3, url_length);
  if (url.indexOf("&") < url.length) {
    end = url.indexOf("&");
  } else {
    end = url.length;
  }
  searchQuery = url.substring(0, end);
	}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) { 
    if(request === "getURL") {   
      sendResponse(searchQuery);
  }
  });

function addIconToOmnibar(tabID, changeInfo, tab) {
    var url = tab.url;
    if (url.indexOf("google.") !== -1) { // Only show the icon on google!
    chrome.pageAction.show(tab.id);
  }
}

chrome.tabs.onUpdated.addListener(onPageUpdate);
chrome.tabs.onHighlighted.addListener(onPageUpdate);
chrome.webNavigation.onHistoryStateUpdated.addListener(onPageUpdate);