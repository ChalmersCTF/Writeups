### Misc2 [300]
Challenge: "Got an artefact file to be analysed. Can you please help me find the hidden data ?" and there is a file attached

The first thing I did was to check what type of files by running ```file``` and ```binwalk``` on it

```sh
root@kali:~/Downloads# file artefact 
artefact: XZ compressed data
root@kali:~/Downloads# binwalk artefact 

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             xz compressed data
```
So the next step is to decompress it as following:
```sh
root@kali:~/Downloads# mv artefact artefact.xz
root@kali:~/Downloads# unxz artefact.xz 
```
I run ```file``` again and it appears to be an ext3 file system. 
```sh
root@kali:~/Downloads# file artefact 
artefact: Linux rev 1.0 ext3 filesystem data, UUID=c6666f0c-f641-4958-be07-bcc6540fdafd (large files)
```
Mounting the file I got a bunch of useless files that had no meaning. So I thought I might use a recovery tool to try to recover files and voala!!
```sh
root@kali:~/Downloads# extundelete artefact --restore-all
NOTICE: Extended attributes are not restored.
Loading filesystem metadata ... 7 groups loaded.
Loading journal descriptors ... 2459 descriptors loaded.
Searching for recoverable inodes in directory / ... 
3359 recoverable inodes found.
Looking through the directory structure for deleted files ... 
0 recoverable inodes still lost.
```
I take a fast look and there were two directories:
```sh
root@kali:~/Downloads/RECOVERED_FILES# ls
file_system  lost+found
```
The lost and found had nothing fun to play with,m however the file_system directory had. By looking at the files there were alot of .junk files and some other files that seems interesting as following:
```sh
root@kali:~/Downloads/RECOVERED_FILES/file_system# find . -type f ! -name "*.junk"
./nWmvPmR6.txt
./lSuTMh4S/6aWF09H.txt
./lSuTMh4S/7QV67ZU NS/hEXHe9/g098s8QrvhZGgYuI3.txt
./lSuTMh4S/7QV67ZU NS/hEXHe9/2hbyzUDNC5evUv.txt
./lSuTMh4S/7QV67ZU NS/hEXHe9/FauyaO5RHVMi.txt
./rQl9dUrq3Oi1Q.txt
./12 OcjNU .txt~
./ts8U/c0pmcYvxe
./12 OcjNU .txt
./.12 OcjNU .txt.swp
./c0pmcYvxe.txt
./7bMqJpEOW.txt
```

By looking into them one by one i found a small hint and I knew then to skip looking at the other dir:
```sh
root@kali:~/Downloads/RECOVERED_FILES/file_system# cat 12\ OcjNU\ .txt
 flag text is somewhere inside 
```
I noticed one interesting file ```./ts8U/c0pmcYvxe``` So i check and it appear to be some corrupted data:
```sh
root@kali:~/Downloads/RECOVERED_FILES/file_system/ts8U# file c0pmcYvxe 
c0pmcYvxe: data
``
So i inspect the header:
```sh
root@kali:~/Downloads/RECOVERED_FILES/file_system/ts8U# xxd c0pmcYvxe | head -1
00000000: 0000 0000 0010 4a46 4946 0001 0101 0078  ......JFIF.....x
```
and from ```JFIF``` it appears to be a JPEG file but it does not have the magical 
number ```FFD8```, so I fire up hexeditor and add it.

![Hexedit](/Misc2/images/hexedit.PNG)

I check the new file for the last time:
```sh
root@kali:~/Downloads/RECOVERED_FILES/file_system/ts8U# file c0pmcYvxe.jpg 
c0pmcYvxe.jpg: JPEG image data, JFIF standard 1.01, resolution (DPI), density 120x120, segment length 16, baseline, precision 8, 250x66, frames 1
```
 And here was our flag
![flag](/Misc2/images/c0pmcYvxe.jpg)