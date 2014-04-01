function getURL(tabID, changeInfo, tab){
    var url = tab.url;
    var begin = url.indexOf("?q=");
    var end = url.indexOf("&");
    searchQuery = url.substring(begin + 3, end);  
	}; 

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) { 
    if(request === "getURL") {   
      sendResponse(searchQuery);
  }
  });

chrome.tabs.onUpdated.addListener(getURL);
chrome.tabs.onHighlighted.addListener(getURL);
