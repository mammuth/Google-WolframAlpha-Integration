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
Get and Parse the Wolfram|Alpha result XML
*/

// Der nachfolgende ajax-Request wird nicht ausgeführt, Log Error: No 'Access-Control-Allow-Origin' header is present on the requested resource.
// Problem scheint zu sein, dass man keine Cross-Domain Requests machen darf. Sprich man darf in dem Script, das ja auf google.de ausgeführt wird, keinen Request an facebook.com schicken?!
// https://en.wikipedia.org/wiki/Cross-origin_resource_sharing
// Aber da muss es ja eine Lösung für geben...
$.ajax({
  type: "GET",
  dataType: "xml",
  crossDomain: true,
  // url: "http://api.wolframalpha.com/v2/query?input=sunrise+munich&appid=8X6XE5-Q5887TY7TE",
  url: "http://www.maxi-muth.de/sitemap.xml",
  success: function(xml){
  // Never gets here...
   console.log("Got the XML!");
   $(xml).find("subpod").each(function(){
    // Find correct subpod
    if($(this).attr("title") != "Input interpretation"){
	    // Append the subpod title to the Google stats
		stats.innerHTML = stats.innerHTML + $(this).attr("title")+"<br />");		
	}
   });
  }
 });