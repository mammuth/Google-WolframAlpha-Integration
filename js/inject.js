/* 
Process Flow:
1. Pass the Google Search Query to Wolfram|Alpha and get the result as XML
2. Parse that XML to get a HTML-Object of the Result
3. Inject this object beautifully into the Google Site
*/

// Start when DOM is ready
$( document ).ready(function() {

	// Determine whether Google provided their own "Quick Results"
	if (!document.getElementsByClassName("vk_c")[0]) {
		console.log("Google has NO 'Quick Results' --> Query WolframAlpha!");
		requestWolframResult(getSearchQuery());
	} else {
		console.log("Google has their 'Quick Results' --> no need for WolframAlpha");
		
	}
    
});

injectWolframButton(getSearchQuery());
/*
Inject a Button "Search on Wolfram Alpha!" when not displaying them automatically
*/
function injectWolframButton(searchQuery) {
	// Result Container
	var wolframButton = document.createElement("button");
	wolframButton.id = "wolframButton";
	wolframButton.innerHTML = "Wolfram|Alpha";
	wolframButton.setAttribute("type", "button");
    wolframButton.setAttribute("value", "wolfram");
    wolframButton.setAttribute("name", "wolframButton");
    wolframButton.setAttribute("onclick", "runWolfram()");
	document.getElementsById("rcnt").parentNode.insertBefore(wolframButton, document.getElementById("rcnt"));
}

/*
Get search query string (eg. sunrise+munich)
returns searcg query
*/
function getSearchQuery() {
	var searchQuery = document.getElementById('gbqfq').value.replace(/ /g, "+");
	console.log("searchQuery: "+searchQuery);
	return searchQuery;
}

/* 
Get and Parse the Wolfram|Alpha result XML
*/
function requestWolframResult(searchQuery) {
	var xmlhttp = new XMLHttpRequest();
	 
	xmlhttp.onreadystatechange = function(){
	  if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
			var xmlDoc = xmlhttp.responseXML;
			/* Plaintext Result */
			var pods = xmlDoc.getElementsByTagName("pod");
			var plaintexts = xmlDoc.getElementsByTagName("plaintext");
			var imgs = xmlDoc.getElementsByTagName("img");
			
			/* txt = "";
			// Skip first pod
			 for (i=1; i<4; i++){
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
			
			/* Inject the result */
			// As plaintext
			// displayResultAsPlaintext(plaintexts[1].textContent, pods[1].getAttribute("title"), searchQuery);
			// As image
			displayResultAsImage(imgs[1].getAttribute("src"), imgs[1].getAttribute("width"), imgs[1].getAttribute("height"), imgs[1].getAttribute("title"), imgs[1].getAttribute("alt"), pods[1].getAttribute("title"), searchQuery);
		}
	  }
	xmlhttp.open("GET","http://api.wolframalpha.com/v2/query?input="+searchQuery+"&appid=8X6XE5-Q5887TY7TE",true);
	// xmlhttp.open("GET","http://www.maxi-muth.de/wa.xml",true);
	xmlhttp.send();
}

/* Inject result as image */
function displayResultAsImage(imgSrc, width, height, title, alt, description, searchQuery) {
	// Result Container
	var resultDiv = document.createElement("div");
	resultDiv.id = "resultDiv";
	// Description
	var descriptionDiv = document.createElement("div");
	descriptionDiv.id = "description";
	// Image
	var resultImg = document.createElement("img");
	resultImg.id = "resultImg";
	// More link
	var moreLink = document.createElement("a");
	moreLink.id = "moreLink";
	
	// Set image
	resultImg.src = imgSrc;
	resultImg.title = title;
	resultImg.alt = alt;
	// resultImg.width = width;
	// resultImg.height = height;
	
	// Setdescription
	descriptionDiv.innerHTML = description;	
	
	// More link
	moreLink.appendChild(document.createTextNode("More"));
	moreLink.title = "All details on the awesome site of Wolfram|Alpha";
	moreLink.href = "http://www.wolframalpha.com/input/?i="+searchQuery;
	moreLink.target = "_blank";
	
	// Insert result div into DOM	
	document.getElementById("rcnt").parentNode.insertBefore(resultDiv, document.getElementById("rcnt"));
	
	// Add Description and more link into resultDiv
	document.getElementById("resultDiv").appendChild(resultImg);
	document.getElementById("resultDiv").appendChild(descriptionDiv);
	document.getElementById("resultDiv").appendChild(moreLink);
	
}

/* Inject result as plaintext */
function displayResultAsPlaintext(result, description, searchQuery) {
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
	moreLink.title = "All details on the awesome site of Wolfram|Alpha";
	moreLink.href = "http://www.wolframalpha.com/input/?i="+searchQuery;
	moreLink.target = "_blank";
	
	// Insert result div into DOM	
	document.getElementById("rcnt").parentNode.insertBefore(resultDiv, document.getElementById("rcnt"));
	// Add Description and more link into resultDiv
	document.getElementById("resultDiv").appendChild(descriptionDiv);
	document.getElementById("resultDiv").appendChild(moreLink);
}