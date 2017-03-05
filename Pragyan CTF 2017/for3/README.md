## The Karaboudjan (150pts) 
By: [noras] from [ChalmersCTF](http://chalmersctf.se)

##### Challenge Description : 
```
Captain Haddock is on one of his ship sailing journeys when he gets stranded off the coast of North Korea. He finds shelter off a used nuke and decides to use the seashells to engrave a message on a piece of paper. Decrypt the message and save Captain Haddock.

->-.>-.---.-->-.>.>+.-->--..++++.
.+++.
.->-.->-.++++++++++.+>+++.++.-[->+++<]>+.+++++.++++++++++..++++[->+++<]>.--.->--.>.

NOTE :- Please enclose the flag in the format pragyanctf{<flag>}.

```
* File : [clue.zip](files/clue.zip)

#### Solution:

The clue is a password protected zip file. I only had to crack it using the metasplot wordlists as following.

```sh
$ cd /usr/share/wordlists/metasploit/
$ cat *>allall
$ fcrackzip -v -D -u -p /usr/share/wordlists/metasploit/allall clue.zip 
found file 'clue.pcap', (size cp/uc    106/   117, flags 9, chk b64a)

PASSWORD FOUND!!!!: pw == dissect
```

The pcap contains only one packet that has the flag ```$JACKPOT$theflagis-{5n00p_d099}```