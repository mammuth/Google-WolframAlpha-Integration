/* 
Process Flow:
1. Pass the Google Search Query to Wolfram|Alpha and get the result as XML
2. Parse that XML to get a HTML-Object of the Result
3. Inject this object beautifully into the Google Site
*/
chrome.runtime.sendMessage("getURL", function(response) {
  requestWolframResult(response);

})
// Start when DOM is ready
/*$( document ).ready(function() {
    requestWolframResult(getSearchQuery());
});
*/

/*
Get search query string (eg. sunrise+munich)
returns search query
*/
/*

function getSearchQuery() {

	var searchQuery_ = document.getElementById('gbqfq').value.replace(/ /g, "+");
	//console.log("searchQuery: "+searchQuery_);
	return searchQuery_;
}
 */
/* 
Get and Parse the Wolfram|Alpha result XML
*/

function requestWolframResult(searchQuery) {
	var xmlhttp = new XMLHttpRequest();
	 
	xmlhttp.onreadystatechange = function(){
	  if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
			xmlDoc=xmlhttp.responseXML;
			/* Plaintext Result */
			var pods = xmlDoc.getElementsByTagName("pod");
			var plaintexts = xmlDoc.getElementsByTagName("plaintext");
			txt = "";
			// Skip first pod
			/* for (i=1; i<4; i++){
				// Get pod title
				txt = txt + pods[i].getAttribute("title") + ": ";
				console.log("pod #"+i+" title: "+pods[i].getAttribute("title"));
				// Get value of "plaintext"-node
				txt = txt + plaintexts[i].textContent + ".  ";
				console.log("plaintext #"+i+" : "+plaintexts[i].textContent);
			} */			
			
			console.log(searchQuery);
			console.log(plaintexts[1].textContent);
			console.log(pods[1].getAttribute("title"));
			
			// inject and fill result div
			displayResults(plaintexts[1].textContent, pods[1].getAttribute("title"), searchQuery);
		}
	  }
	xmlhttp.open("GET","http://api.wolframalpha.com/v2/query?input="+searchQuery+"&appid=8X6XE5-Q5887TY7TE",true);
	xmlhttp.send();
}

function displayResults(result, description, searchQuery) {
	// Result
	var resultDiv = document.createElement("div");
	resultDiv.id = "resultDiv";
	// Description
	var descriptionDiv = document.createElement("div");
	descriptionDiv.id = "description";
	// More link
	var moreLink = document.createElement("a");
	moreLink.id = "moreLink";
	
	// Set content of result div and description
	resultDiv.innerHTML = result;	
	descriptionDiv.innerHTML = description;
	// More link
	moreLink.appendChild(document.createTextNode("More"));
	moreLink.title = "More2";
	moreLink.href = "http://www.wolframalpha.com/input/?i="+searchQuery;
	moreLink.target = "_blank";
	
	// Insert result div into DOM	
	document.getElementById("rcnt").parentNode.insertBefore(resultDiv, document.getElementById("rcnt"));
	// Add Description and more link into resultDiv
	document.getElementById("resultDiv").appendChild(descriptionDiv);
	document.getElementById("resultDiv").appendChild(moreLink);
}