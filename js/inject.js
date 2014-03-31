/* 
Process Flow:
1. Pass the Google Search Query to Wolfram|Alpha and get the result as XML
2. Parse that XML to get a HTML-Object of the Result
3. Inject this object beautifully into the Google Site
*/

// Object of the result Statistics on the Google Page
var stats  = document.querySelector('div[id="resultStats"]');

stats.innerHTML = 'Powered By Diskrete Informatiker';

/*
Get Search Query String (eg. sunrise+munich)
*/
var searchQuery = document.getElementById('gbqfq').value.replace(/ /g, "+");
console.log("searchQuery: "+searchQuery);
// Only "problem": We probably should delay the XMLHttpRequest since the searchQuery isn't read as fast. Alternativley we may use the Chrome API to fetch the query from the URL-Bar

/* 
Get and Parse the Wolfram|Alpha result XML
*/
var xmlhttp = new XMLHttpRequest();
 
xmlhttp.onreadystatechange = function(){
  if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
		xmlDoc=xmlhttp.responseXML;
		/* Plaintext Result */
		var pods = xmlDoc.getElementsByTagName("pod");
		var plaintexts = xmlDoc.getElementsByTagName("plaintext");
		txt = "";
		// Skip first pod
		for (i=1; i<4; i++){
			// Get pod title
			txt = txt + pods[i].getAttribute("title") + ": ";
			console.log("pod #"+i+" title: "+pods[i].getAttribute("title"));
			// Get value of "plaintext"-node
			txt = txt + plaintexts[i].textContent + ".  ";
			console.log("plaintext #"+i+" : "+plaintexts[i].textContent);
		}
		
		// Just for testing - here it should nicely inject in own elements
		stats.innerHTML = txt;
    }
  }
// http://api.wolframalpha.com/v2/query?input="+searchQuery+"&appid=8X6XE5-Q5887TY7TE
xmlhttp.open("GET","http://www.maxi-muth.de/wa.xml",true);
xmlhttp.send();