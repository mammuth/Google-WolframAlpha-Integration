/* 
Process Flow:
1. Pass the Google Search Query to Wolfram|Alpha and get the result as XML
2. Parse that XML to get a HTML-Object of the Result
3. Inject this object beautifully into the Google Site
*/
/* Get Search Query out of URL and think about we should really go for Wolfram instead of Google */
(function(undefined){

// function getURL() {	
// 	chrome.runtime.sendMessage("getURL", function(response) {
// 		searchQuery = response;
// 		console.log("url = "+response);
// 		// Determine whether Google provided their own "Quick Results"
// 		if (!document.getElementsByClassName("vk_cxp")[0]) {
// 			console.log("Google has NO 'Quick Results' --> Query WolframAlpha!");
// 			requestWolframResult(response);		
// 		} else {
// 			injectWolframButton(response);
// 			console.log("Google has their 'Quick Results' --> no need for WolframAlpha");
// 		}   
// 	});
// }

function main(){
	var searchQuery = extractSearchQuery(getURL()); 

	// Determine whether Google provided their own "Quick Results"
	if (!document.getElementsByClassName("vk_c")[0]) {
		console.log("Google has NO 'Quick Results' --> Query WolframAlpha!");
		toggleLoadingIndicator();
		requestWolframResult(searchQuery);	
	} else {
		injectWolframButton(searchQuery);
		console.log("Google has their 'Quick Results' --> no need for WolframAlpha");
	}   

}

window.onpopstate = main(); //calls the method on every history change




function toggleLoadingIndicator() {
	if($('#wa_loading').length) {
		$('#wa_loading').hide();
	} else {
		$('#hdtb-msb').append('<div id="wa_loading" class="loading" title="Wolfram Alpha is loading"></div>');
	}
}

function getURL() {
	console.log('getURL() returns '+document.URL);
	return document.URL;
}
function extractSearchQuery(url) {
	var orig = url;
	var begin;
	var end;
	if(url.lastIndexOf("#q=") !== -1) {
		begin = url.lastIndexOf("#q=");
	} else {
		begin = url.lastIndexOf("?q=");
	}

	url = url.substring(begin +3, url.length);
	if (url.indexOf("&") < url.length) {
		end = url.indexOf("&");
	} else {
		end = url.length;
	}

	searchQuery = url.substring(0, end);
	console.log("extractSearchQuery("+orig+") returns "+searchQuery);
	return searchQuery;
}


/*
Inject a Button "Search on Wolfram Alpha!" when not displaying them automatically
*/
function injectWolframButton(searchQuery) {
	if($('#wolframButton').length === 0) { // to avoid double buttons. Two mighty buttons would be too awesome!
		var $input = $('<input type="button" id="wolframButton" value="Seach Wolfram">').click(openWolframWebsite);
		$input.insertBefore("#rcnt");
	}
}

function openWolframWebsite(){
	window.open("//www.wolframalpha.com/input/?i="+searchQuery, "_blank");
}

/* 
Get and Parse the Wolfram|Alpha result XML
*/
function requestWolframResult(searchQuery) {
	console.log("called requestWolframResult() with searchQuery="+searchQuery);
	var xmlhttp = new XMLHttpRequest();

	xmlhttp.onreadystatechange = function(){
		if (xmlhttp.readyState == 4 && xmlhttp.status === 200){
			var xmlDoc = xmlhttp.responseXML;
			/* Plaintext Result */
			var pods = xmlDoc.getElementsByTagName("pod");
			var plaintexts = xmlDoc.getElementsByTagName("plaintext");
			var imgs = xmlDoc.getElementsByTagName("img");

			console.log(searchQuery);
			console.log(plaintexts[1].textContent);
			console.log(pods[1].getAttribute("title"));
			
			/* Inject the result */
			// As plaintext
			//displayResultAsPlaintext(plaintexts[1].textContent, pods[1].getAttribute("title"), searchQuery);
			// As image
			displayResultAsImage(imgs[1].getAttribute("src"), imgs[1].getAttribute("width"), imgs[1].getAttribute("height"), imgs[1].getAttribute("title"), imgs[1].getAttribute("alt"), pods[1].getAttribute("title"), searchQuery);
			toggleLoadingIndicator();
		}
	};
	xmlhttp.open("GET","https://api.wolframalpha.com/v2/query?input="+searchQuery+"&appid=8X6XE5-Q5887TY7TE",true);
	xmlhttp.send();
}

/* Inject result as image */
function displayResultAsImage(imgSrc, width, height, title, alt, description, searchQuery) {
	// Result Container
	if ($('#resultDiv').length === 0) { //if the div doesn't already exists:
		var resultDiv = document.createElement("div");
	resultDiv.id = "resultDiv";
		// Insert result div into DOM	
		document.getElementById("rcnt").parentNode.insertBefore(resultDiv, document.getElementById("rcnt"));
		// Add Description and more link into resultDiv
	} 
	$('#resultDiv').text(""); //resets the element.
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
	moreLink.appendChild(document.createTextNode("provided by WolframAlpha. Click for more"));
	moreLink.title = "All details on the awesome site of Wolfram|Alpha";
	moreLink.href = "http://www.wolframalpha.com/input/?i="+searchQuery;
	moreLink.target = "_blank";
	$('#resultDiv').append(descriptionDiv);
	$('#resultDiv').append(moreLink);

	// Add Description and more link into resultDiv
	$('#resultDiv').append(resultImg);
	$('#resultDiv').append(descriptionDiv);
	$('#resultDiv').append(moreLink);
	
}

/* Inject result as plaintext */
function displayResultAsPlaintext(result, description, searchQuery) {
	// Result
	if ($('#resultDiv').length === 0) { //if the div doesn't already exists:
		var resultDiv = document.createElement("div");
	resultDiv.id = "resultDiv";
		// Insert result div into DOM	
		document.getElementById("rcnt").parentNode.insertBefore(resultDiv, document.getElementById("rcnt"));
		// Add Description and more link into resultDiv
	}	
	$('#resultDiv').text(result);	

	// Description
	var descriptionDiv = document.createElement("div");
	descriptionDiv.id = "description";
	// More link
	var moreLink = document.createElement("a");
	moreLink.id = "moreLink";

	// Set content of result div and description
	descriptionDiv.innerHTML = description;
	// More link
	moreLink.appendChild(document.createTextNode("More"));
	moreLink.title = "All details on the awesome site of Wolfram|Alpha";
	moreLink.href = "http://www.wolframalpha.com/input/?i="+searchQuery;
	moreLink.target = "_blank";
	$('#resultDiv').append(descriptionDiv);
	$('#resultDiv').append(moreLink);
	
}
})();
