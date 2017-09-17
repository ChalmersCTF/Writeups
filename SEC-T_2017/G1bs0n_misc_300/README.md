# G1bs0n - misc 300
###### @mjdubell - ChalmersCTF

```
Agent Gill called, we have until tomorrow at 15:00 UTC to fix some virus problem.

File: G1bs0n.tar.gz
```

Even though I followed too many rabbit holes, this was a fun challenge to work on. In order to solve this challenge, you would need some basic understanding on how to analyze memory dumps. I solved this challenge with `volatility` which is a forensic tool for analyzing memory dumps, and it's built with python! Volatility can be found here https://github.com/volatilityfoundation/volatility

After downloading the memory dump, I ran `strings G1bs0n > strings.txt` which I then skimmed through to see what kind of information was present. I could quickly determine that the memory dump belonged to a Windows 7 system. Volatility can also help identifying the system by running `vol.py -f G1bs0n imageinfo` which returned:

```
vagrant@stretch:~/G1bson$ vol.py -f G1bs0n imageinfo
Volatility Foundation Volatility Framework 2.6
INFO    : volatility.debug    : Determining profile based on KDBG search...
          Suggested Profile(s) : Win7SP1x64, Win7SP0x64, Win2008R2SP0x64, Win2008R2SP1x64_23418, Win2008R2SP1x64, Win7SP1x64_23418
                     AS Layer1 : WindowsAMD64PagedMemory (Kernel AS)
                     AS Layer2 : VMWareAddressSpace (Unnamed AS)
                     AS Layer3 : FileAddressSpace (/home/vagrant/G1bson/G1bs0n)
                      PAE type : No PAE
                           DTB : 0x187000L
                          KDBG : 0xf8000284f0a0L
          Number of Processors : 1
     Image Type (Service Pack) : 1
                KPCR for CPU 0 : 0xfffff80002850d00L
             KUSER_SHARED_DATA : 0xfffff78000000000L
           Image date and time : 2017-09-03 10:33:21 UTC+0000
     Image local date and time : 2017-09-03 12:33:21 +0200
```

Now that the system has been identified, the hunt for the flag can begin!

## RECON

I begun by extracting a list of all files present in the dump.
```
vol.py -f G1bs0n --profile=Win7SP0x64 filescan > filescan.txt
```

From here I could identify some interesting files such as:
```
0x000000003fe14390     16      0 R--rwd \Device\HarddiskVolume2\Users\plauge\Desktop\g4rb4g3.txt
```

Let's extract the contents of that file!
```
vol.py -f G1bs0n --profile=Win7SP0x64 dumpfiles -Q 0x000000003fe14390 --name -D files/
```

Running `strings file.None.0xfffffa8001264bb0.g4rb4g3.txt.dat` revealed `_X43EUC_3H64YC{GPRF`, could this be part of the flag???

## Don't follow the white rabbit

At this point I assumed I had some part of the flag and I followed a few rabbit holes looking for the next part of the flag. But after taking a break, I started looking for files with the keyword `gibson` which yielded the following result:

```
vagrant@stretch:~/G1bson$ grep gibson strings.txt
jpg  C:\T3MP\gibson.jpg
certutil -decode gibson.jpg gibson.zip >nul
del gibson.zip
[...]
```

The windows command `certutil` was used to decode base64 data found in gibson.jpg and the result is gibson.zip. The next step was to search for `gibson` in filescan.txt to find the above files.

```
vagrant@stretch:~/G1bson$ grep gibson filescan.txt
0x000000003ed50dd0     16      0 -W-r-- \Device\HarddiskVolume2\T3MP\gibson.jpgp
```

Great, now extract the file like before:

```
vol.py -f G1bs0n --profile=Win7SP0x64 dumpfiles -Q 0x000000003ed50dd0 --name -D files/
```

Opening the resulting file showed that it contained base64 data, and since we know that certutil was used to decode the data, let's do the same thing:

```
C:\Users\sect\Documents\Virtual_Machines\ubuntu\share
λ certutil -decode gibson.jpgp gibson.zip
Input Length = 4096
Output Length = 1409
CertUtil: -decode command completed successfully.
```

## GET THE FLAG

The .zip file contained three files (run.bat, run.ps1, run.reg) with some interesting data, but only one of them contained the next part of the flag:

```
[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Internet Explorer\Security]
"Special"="}JGS_3G4X_GH0_3Z"
```

Now we have the flag, but it doesn't look correct: `_X43EUC_3H64YC{GPRF}JGS_3G4X_GH0_3Z`

Reversing the flag and applying ROT13 returned the flag, but in the wrong order: `M3_0UT_K4T3_FTW}SECT{PL46U3_PHR34K_`, easy fix!!

The final flag: `SECT{PL46U3_PHR34K_M3_0UT_K4T3_FTW}`
