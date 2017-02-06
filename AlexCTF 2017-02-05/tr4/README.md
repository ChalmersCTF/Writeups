### TR4: Flag logo 
This challenge is just a simple warm up . They were asking about our opinion of their logo. It was an ASCII art flag. Taking a closer look you can see tha the whole flag is made of special charaters except for some numbers and letters showing up. Since I know the format of the flag will be in l337 speak . I dumped the logi in a text file. I wrote this simple script to extract the flag that was ```ALEXCTF{0UR_L0G0_R0CKS}```

```python
#!/usr/bin/python
file=open('flag_logo.txt')
char_set="{}ABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789"
flag=""
for line in file:
  for c in line:
    if c in char_set:
      flag=flag+c
print flag
```