## MI6 (100pts) 
By: [noras] from [ChalmersCTF](http://chalmersctf.se)

##### Challenge Description : 
```
Benji is working with Ethan on another case and has caught some suspicious traffic over the Atlantic. Help Benji decode the sequence.

26 25 30 28 22 25 20 23 21 29 22 24 26 23 21 26 27 20 28 22 25 23 30 29 23 28 24 20 21 26 25 20 23 27 23 29 25 22 23 26 27 29 24 23 30 21 25 24 26 20 24 22 21 30 26 20 25 24 21 23 27 29 26 22 20 21 23 22 30 26 29 26 28 27 22 20 27 29 26 30 28 27 26 23 29 21 22 25 27 24 21 29 25 24 20 25 23 22 30 28 27 29 25 20 24 21 23 20 23 21 29 26

NOTE :- Please enclose the flag in the format pragyanctf{<flag>}.


```
* File : [mi6.exe](files/mi6.exe)

#### Solution:

The file included had a small bash script that seems to extract a archive data included in the same file. After extracting [the archive](files/rev.tar) and decompressing it and looking at the content I find the following ruby script:

```ruby
class Fixnum
  def random_split(set = nil, repeats = false)
    set ||= 1..self
    set = [*set]
    return if set.empty? || set.min > self || set.inject(0, :+) < self
    tried_numbers = []
    while (not_tried = (set - tried_numbers).select {|n| n <= self }).any?
      tried_numbers << number = not_tried.sample
      return [number] if number == self
      new_set = set.dup
      new_set.delete_at(new_set.index(number)) unless repeats
      randomized_rest = (self-number).random_split(new_set, repeats)
      return [number] + randomized_rest if randomized_rest
    end
  end
end

class String
  def ^( other )
    b1 = self.unpack("U*")
    b2 = other.unpack("U*")
    longest = [b1.length,b2.length].max
    b1 = [0]*(longest-b1.length) + b1
    b2 = [0]*(longest-b2.length) + b2
    b1.zip(b2).map{ |a,b| a^b }.pack("U*")
  end
end

a2= Array.new
a= Array.new
string = gets
a=string.upcase.chars
sum = 0
length1 = a.length

for i in 0..a.length-1  ## /n is worth 10 characters change to length-1 at the end
  a[i] = (a[i].ord)^61
  sum = sum + a[i].ord
end
for i in 0..length1-1
  a2[i] = a[i].to_i.random_split(20..30)
end
# Print the final output array which will be used for reversing
for i in 0..a2.length-1
  print a2[i].join(" ") + " "
end

```
### Analysis:
So first it creats an array of upercase character ```a=string.upcase.chars``` the it loops and XOR with the value of 61.

The next part is using the function random split. The function seems to take the number and randomly split it between the numbers of 20 and 30. ```a2[i] = a[i].to_i.random_split(20..30)```

### Solution Script:
I first created a list with all the capital letters xored with 61 I also added the brakets '{' and '}' just in case and transfared them to numbers.

The next step is predicting what cosective numbers represent what because there might be several possibilites.

So I came up with the folloing script:

```python
import string

def extractPossibilities(bindexs,r=0):
	starts=[]
	for bindex in bindexs:
		suma=0
		for i in range(bindex+1,len(cipher),1):
			suma=sum(cipher[bindex:i])
			if suma in caps_xor_61:
				
				starts.append(i)
				if r==1:
					addRoute(bindex,i,chr(suma^61))
	return starts


def addRoute(start,end,ch):
	p={'start':start,'end':end,'ch':ch}
	if p not in routes:
		routes.append(p)
		print str(start)+':'+str(end)+ '\t\t' +ch


routes=[]


caps= range(65,91,1)#string.ascii_uppercase #65-90

caps_xor_61=[124,127,126,121,120,123,122,117,116,119,118,113,112,115,114,109,108,111,110,105,104,107,106,101,100,103,70,64]

cipher=[26,25,30,28,22,25,20,23,21,29,22,24,26,23,21,26,27,20,28,22,25,23,30,29,23,28,24,20,21,26,25,20,23,27,23,29,25,22,23,26,27,29,24,23,30,21,25,24,26,20,24,22,21,30,26,20,25,24,21,23,27,29,26,22,20,21,23,22,30,26,29,26,28,27,22,20,27,29,26,30,28,27,26,23,29,21,22,25,27,24,21,29,25,24,20,25,23,22,30,28,27,29,25,20,24,21,23,20,23,21,29,26]

bindexs=[0]
#build the tree
while bindexs:
	bindexs=extractPossibilities(bindexs,1)
```

The outout of this script was:

```
0:4			P
4:9			R
9:13		X
9:14		A
13:16		{
13:18		H
14:19		G
16:21		G
19:22		{
19:23		Y
21:25		T
22:26		S
23:27		U
23:28		A
25:30		J
26:31		I
27:32		M
28:33		N
30:35		K
31:34		{
31:36		G
32:37		B
33:37		U
33:38		C
34:39		G
36:39		{
36:41		F
37:42		B
38:42		T
39:43		W
41:45		W
41:46		B
42:47		F
43:48		F
45:48		{
45:50		I
46:51		J
47:50		{
47:52		I
48:51		{
48:53		L
50:55		F
51:56		J
52:57		G
53:57		X
55:60		L
56:59		{
56:61		E
57:62		A
60:64		U
60:65		A
59:63		T
59:64		B
61:66		K
62:67		M
64:67		}
64:69		I
65:70		G
63:68		Q
66:70		X
67:71		V
69:73		P
70:74		S
68:72		R
71:75		Z
71:76		F
74:79		A
72:77		A
76:80		M
79:83		R
77:81		L
80:84		U
83:88		E
81:85		T
81:86		C
84:89		A
88:92		X
88:93		C
85:90		J
86:91		J
89:94		F
92:97		H
93:98		O
90:95		J
91:96		F
94:99		E
97:101		V
98:102		O
95:98		{
95:99		Y
96:100		Z
99:103		P
101:106		J
102:107		L
100:104		X
103:108		Q
106:111		I
107:110		}
104:109		R
```


After tracing some numbers by hand I found the route that works best as the flag:

```
0:4			P
4:9			R
9:14		A
14:19		G
19:23		Y
23:28		A
28:33		N
33:38		C
38:42		T
42:47		F
47:50		{
50:55		F
55:60		L
60:65		A
65:70		G
70:74		S
74:79		A
79:83		R
83:88		E
88:93		C
93:98		O
98:102		O
102:107		L
107:110		}
```
