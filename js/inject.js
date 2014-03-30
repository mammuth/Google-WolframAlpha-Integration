// lol - du gehörst hier hin
/* 
Process Flow:
1. Pass the Google Search Query to Wolfram|Alpha and get the result as XML
1.1. http://api.wolframalpha.com/v2/query?input=sunrise+munich&appid=8X6XE5-Q5887TY7TE (only 2000 Requests / Month with that App ID...)
2. Parse that XML to get a HTML-Object of the Result
3. Inject this object beatifully into the Google Site
*/

// Just for testing the url Pattern in the manifest
document.getElementById('resultStats').innerHTML = 'Powered By Diskrete Informatiker';
