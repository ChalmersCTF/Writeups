## The Vault (75pts)
By: [ChalmersCTF](http://chalmersctf.se)

##### Challenge Description : 
```
[!@# a-z $%^ A-Z &* 0-9] [1,3]
```
File : [file](files/file.kdb)

#### Solution:

Running ```file ``` on the included file revealed that its a keepass file. And the regex seems to be the clue about the password.

'''sh
$ file file
file.kdb: Keepass password database 1.x KDB, 3 groups, 4 entries, 50000 key transformation rounds

'''

So we generate [passwordlist](files.combos.txt) using the regex

'''python
#!/usr/bin/env python
import string
import itertools

table = string.ascii_letters + string.digits + "!@# $%^&*"

with open("combos.txt","w+") as file:
	for x in itertools.combinations(table, 3):
		file.write("".join(x)+"\n")
'''

extract the key from the file 

'''sh
$ mv file file.kdb
$ keepass2john file.kdb > keypasskey
$ john --wordlist=combos.txt  --format=keepass keypasskey
	Session completed
$ john  keypasskey --show
file.kdb:k18

1 password hash cracked, 0 left

'''