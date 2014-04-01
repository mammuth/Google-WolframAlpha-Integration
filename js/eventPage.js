function onPageUpdate(tabID, changeInfo, tab) {
  getURL(tabID, changeInfo, tab);  
  addIconToOmnibar(tabID, changeInfo, tab);
}

function getURL(tabID, changeInfo, tab){
  var url = tab.url;
  var begin = url.lastIndexOf("?q=");
  if (url.lastIndexOf("&") < begin) {
    var end = url.lastIndexOf("&");
  } else {
    var end = url.length;
  }; 
  //var end = url.indexOf("&");
  searchQuery = url.substring(begin + 3, end);

	}; 

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) { 
    if(request === "getURL") {   
      sendResponse(searchQuery);
  }
  });

function addIconToOmnibar(tabID, changeInfo, tab) {
    chrome.pageAction.show(tab.id);
}

chrome.tabs.onUpdated.addListener(onPageUpdate);
chrome.tabs.onHighlighted.addListener(onPageUpdate);
