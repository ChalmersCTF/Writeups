# Re2 : C++ is fun: [100]
So you get a binary when running it you get a message to enter the flag. When entering somthing wrong it tells you to try again. However, since I know that the flag starts with "ALEXCTF{" I trief that and got the message "You should have the flag by now" then I thought that the original code might look somthing like this
```c++
#include <stdio.h>
#include <string.h>
using namespace std;
int main () {
  string flag="....";
  string input;
  cout << "Your flag: ";
  cin >> input;
   if (!flag.compare(0, input.size(), input))
      cout<< "You should have the flag by now\n";
    }
  return 0;
}
```

Now I can try to bruteforce it by writing a small python script as following:

```python
#!/usr/bin/python

import os

bin="~/Downloads/re2 ";
char_set="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_{}";
flag=""

while "}" not in flag:
  for c in char_set:
    flag_test=flag+c
    p = os.popen(bin+flag_test,"r")
    line = p.readline()
    if "flag" in line:
      flag=flag+c
      print flag
      break
```

By running this script I got the flag `ALEXCTF{W3_L0v3_C_W1th_CL45535}`