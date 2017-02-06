### Re4: Python rev
In this challenge we got a python byte-code file. So the first step was to get the source code for this file. By using *uncompyle2* we could get the python source code. That looked like this.
```python  
import md5
md5s = [174282896860968005525213562254350376167L,
 137092044126081477479435678296496849608L,
 126300127609096051658061491018211963916L,
 314989972419727999226545215739316729360L,
 256525866025901597224592941642385934114L,
 115141138810151571209618282728408211053L,
 8705973470942652577929336993839061582L,
 256697681645515528548061291580728800189L,
 39818552652170274340851144295913091599L,
 65313561977812018046200997898904313350L,
 230909080238053318105407334248228870753L,
 196125799557195268866757688147870815374L,
 74874145132345503095307276614727915885L]
print 'Can you turn me back to python ? ...'
flag = raw_input('well as you wish.. what is the flag: ')
if len(flag) > 69:
    print 'nice try'
    exit()
if len(flag) % 5 != 0:
    print 'nice try'
    exit()
for i in range(0, len(flag), 5):
    s = flag[i:i + 5]
    if int('0x' + md5.new(s).hexdigest(), 16) != md5s[i / 5]:
        print 'nice try'
        exit()

print 'Congratz now you have the flag'
```
So now we know that every set of five characters represent an md5 hash in the md5s list. Now we have to do a reverse hash to find our flag. By using online services we could find all the parts except for the 6th hash. So it was time for bruiteforcing it. By modfing the script we got the missing part thus the flag ```ALEXCTF{dv5d4s2vj8nk43s8d8l6m1n5l67ds9v41n52nv37j481h3d28n4b6v3k}```

```python
import md5
import itertools
md5s = [174282896860968005525213562254350376167L, #ALEXC
137092044126081477479435678296496849608L,  #TF{d
126300127609096051658061491018211963916L,  #5d4s2
314989972419727999226545215739316729360L,  #vj8nk
256525866025901597224592941642385934114L,  #43s8d
115141138810151571209618282728408211053L,  #8l6m1
8705973470942652577929336993839061582L,  
256697681645515528548061291580728800189L, # ds9v4
39818552652170274340851144295913091599L, # 1n52n
65313561977812018046200997898904313350L, # v37j4
230909080238053318105407334248228870753L, # 81h3d
196125799557195268866757688147870815374L, # 28n4b
74874145132345503095307276614727915885L]  # 6v3k}

data_set="abcdefghijklmnopqrstuvwxyz1234567890_"
flag_log="[]";

for c in itertools.permutations(data_set, 5):
 flag_part=''.join(c)
 print flag_part
  if int('0x' + md5.new(flag_part).hexdigest(), 16) == md5s[6]:
    flag_log=flag_log+"[part "+str(i+1)+" " +flag_part+"]"
  print flag_log
```

You can also do that using *hashcat* or *pwntools* as following:
```
print util.iters.mbruteforce(lambda x: "068cb5a1cf54c078bf0e7e89584c1a4e" == hashlib.md5(x).hexdigest() , string.lowercase+string.uppercase+string.digits,length = 5)
```