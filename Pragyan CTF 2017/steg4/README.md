## New Avenger (300pts)
By: [noras] from [ChalmersCTF](http://chalmersctf.se)

##### Challenge Description : 
```
The Avengers are scouting for a new member. They have travelled all around the world, looking for suitable candidates for the new position.
Finally, they have found the perfect candidate. But, they are in a bad situation. They do not know who the guy is behind the mask.
Can you help the Avengers to uncover the identity of the person behind the mask ?

Hint! When all strings are of the same length, it starts to make sense.
```
* File : [avengers.gif](files/avengers.gif)


#### Solution:

Unfortunately, I solved this challenge 10 minutes after the CTF was over. So the first step is to run ```binwalk``` or ```foremost```. Doing that I could see that there was a *zip file* included. 
```sh
$binwalk avengers.gif
 
DECIMAL         HEX             DESCRIPTION
-------------------------------------------------------------------------------------------------------
0               0x0             GIF image data, version 8"9a", 500 x 272
885278          0xD821E         Zip archive data, at least v2.0 to extract, compressed size: 13422, uncompressed size: 13780, name: "1_image.jpg"
898769          0xDB6D1         Zip archive data, at least v1.0 to extract, compressed size: 1796904, uncompressed size: 1796904, name: "image_2.zip"
```
Unzipping the file revealed *an image: 1_image.jpg* and *another zip file:  image_2.zip*. 
```sh
$ unzip ./avengers.gif
Archive:  avengers.gif
warning [avengers.gif]:  885278 extra bytes at beginning or within zipfile
  (attempting to process anyway)
  inflating: 1_image.jpg
 extracting: image_2.zip
```
 I tried to unzip the new file and it was password protected. So I ran strings on the image an it revealed the password:
```
$ unzip ./image_2.zip
Archive:  image_2.zip
[image_2.zip] 2_image.jpg password:

$ strings 1_image.jpg | tail -1
The password for the next file is :- sgtgFhswhfrighaulmvCavmpsb
```
And I could unzip it, and revealed other zip file and another image with the same thing, so I wrote a script to do that automatically as following.
```python
import os

def extractzip(password,filename):
    cmd='unzip -P '+password+' '+filename
    p = os.popen(cmd,"r")
    line = p.readline()
    if line=='':
        print ' [x] no file named '+filename
        exit(1)

def getPassword(filename):
    cmd='strings '+filename+' | tail -1'
    print ' [+] Extracting Password from '+filename
    p = os.popen(cmd,"r")
    output = p.readline()
    for passwd in output.split(' '):
        if len(passwd)>8:
            print ' [+] Password: '+passwd
            return passwd
    print ' [x] No password found for  '+filename
    exit(1)

imagecount=1
while 1:
    filename=str(imagecount)+'_image.'
    password=getPassword(filename+'jpg')
    imagecount+=1
    filename='image_'+str(imagecount)
    extractzip(password,filename+'.zip')
```
This resulted in 16 images with 15 passwords. Now since the organizers dropped a hint that about the strings being the same length where they referred to the passwords, I dumped the passwords in one file by modifying my previous script and dumped it in the file **passwords.txt**:
```
sgtgFhswhfrighaulmvCavmpsb
lppujmioEaynaqrctesAnztgib
lrphntGpzjhkswskepnilrwwjm
hmohAmgcomgpjjhLnqpkepuazi
qjqxzuSkiyjzazwwsqchiqvgoQ
ujinpqyghiulozjnyprZpnswnp
tsquviQwxtgpgarlxelvakaOpo
jljykvfZSycpvscqvzjwelKhok
cqjausmhroogiuabcbpRmsyzpo
qakrlxrGswfovmxhxpjzfyfrie
jyxbLszctbveelbgxtilzfbQng
heojthirkakqvvmxjgAWzuekcp
nkpbhyUmiabnymvzmcppejiisy
mIsmsmsmxpfvkolTbnkafkgvgx
tsYinxviqeykguqznjscomgqbh
```
So we have 16 passwords where each one is 26-character long. After spending two days on this trying to XOR and extracting capital letters. I tried to map indexes of the caps to the alphabet. This revealed a new string that was meaningless. But trying to brute force ROTing it revealed the flag at ROT 11. My final script was:
```python
import string

f=open('passwords.txt','r')
caps=string.ascii_uppercase
flag=""

for line in f:
	for char in line:
		if char in caps:
				flag+=caps[line.index(char)]

print 'step1 = '+ flag

print '------------------'

for i in range(1,27,1):
	rot=""
	for c in flag:
		rot+=caps[(caps.index(c)+i)% 26 ]
	print 'ROT'+str(i)+"\t"+rot
``` 
## output
```
step1 = ETITGEPGZTGXHIWTHEXSTGBPC
------------------
ROT1    FUJUHFQHAUHYIJXUIFYTUHCQD
ROT2    GVKVIGRIBVIZJKYVJGZUVIDRE
ROT3    HWLWJHSJCWJAKLZWKHAVWJESF
ROT4    IXMXKITKDXKBLMAXLIBWXKFTG
ROT5    JYNYLJULEYLCMNBYMJCXYLGUH
ROT6    KZOZMKVMFZMDNOCZNKDYZMHVI
ROT7    LAPANLWNGANEOPDAOLEZANIWJ
ROT8    MBQBOMXOHBOFPQEBPMFABOJXK
ROT9    NCRCPNYPICPGQRFCQNGBCPKYL
ROT10   ODSDQOZQJDQHRSGDROHCDQLZM
ROT11   PETERPARKERISTHESPIDERMAN
ROT12   QFUFSQBSLFSJTUIFTQJEFSNBO
ROT13   RGVGTRCTMGTKUVJGURKFGTOCP
ROT14   SHWHUSDUNHULVWKHVSLGHUPDQ
ROT15   TIXIVTEVOIVMWXLIWTMHIVQER
ROT16   UJYJWUFWPJWNXYMJXUNIJWRFS
ROT17   VKZKXVGXQKXOYZNKYVOJKXSGT
ROT18   WLALYWHYRLYPZAOLZWPKLYTHU
ROT19   XMBMZXIZSMZQABPMAXQLMZUIV
ROT20   YNCNAYJATNARBCQNBYRMNAVJW
ROT21   ZODOBZKBUOBSCDROCZSNOBWKX
ROT22   APEPCALCVPCTDESPDATOPCXLY
ROT23   BQFQDBMDWQDUEFTQEBUPQDYMZ
ROT24   CRGRECNEXREVFGURFCVQREZNA
ROT25   DSHSFDOFYSFWGHVSGDWRSFAOB
ROT26   ETITGEPGZTGXHIWTHEXSTGBPC
```


