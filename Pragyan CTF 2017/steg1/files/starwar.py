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