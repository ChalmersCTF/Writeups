## Star Wars (100pts)  
By: [noras] from [ChalmersCTF](http://chalmersctf.se)

##### Challenge Description : 
```
Don't search blindly. Look carefully and you will find what you are looking for.
Hint! This challenge is specially made for blind persons :P

```
* File : [star-wars.jpg](images/star-wars.jpg)

#### Solution:

Nothing speacial with the image when you look at it:

![star-wars.jpg](images/star-wars.jpg)

Running strings reveal a bit encoded thing with 54 bits:
```
100110 101010 101010 111010 100110 1010101 011101 010100 11110
```

Since the hint mention that it was made for a blind person I look you "blind alphabet" on google and i found that they are a part of a six-bit character code called **Braille codes**.
You can read more about it here [https://en.wikipedia.org/wiki/Six-bit_character_code](https://en.wikipedia.org/wiki/Six-bit_character_code)

Looking at the tabel from the wikipedia page I made a small script that traslates that:

```python
def translate(bin):
	for key, value in dic.iteritems():
		if value==bin:
			return key
	return bin
s=['100110','101010','101010','111010','100110','101010','101110','101010','011110']
#https://en.wikipedia.org/wiki/Six-bit_character_code
dic={
'a':'100000',
'b':'110000',
'c':'100100',
'd':'100110',
'e':'100010',
'f':'110100',
'g':'110110',
'h':'110010',
'i':'010100',
'j':'010100',
'k':'101000',
'l':'111000',
'm':'101100',
'n':'101110',
'o':'101010',
'p':'111100',
'q':'111110',
'r':'111010',
's':'011100',
't':'011110',
'u':'101001',
'v':'111001',
'w':'010111',
'x':'101101',
'y':'101111',
'z':'101011'
}

flag=""
for ss in s:
	flag+=translate(ss)
print flag
print 'pragyanctf{'+flag+'}'
print 'pragyanctf{'+flag.upper()+'}'
```

The output was:
```
doordonot
pragyanctf{doordonot}
pragyanctf{DOORDONOT}
```

Unfortunatly that was not the flag. I know that **steghide** uses a password to protect files and strings hidden in images. This service can also be used online here [https://futureboy.us/stegano/decinput.html](https://futureboy.us/stegano/decinput.html)

Using that with password ```doordonot``` I got a string that looks like base64. ```YmVjb21lYWplZGltYXN0ZXJ5b3V3aWxs```

Decoding that, I got the flag ```becomeajedimasteryouwill```

