file=open('tr4_flag_logo.txt')
char_set="123456789{}ABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789"
flag=""
for line in file:
  for c in line:
    if c in char_set:
      flag=flag+c
print flag
