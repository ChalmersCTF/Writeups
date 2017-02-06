# Cr5: PRNG
In this challenge we had to break a week Pesudo random number generator. We were provided a basic socket connection ```nc 195.154.53.62 7412``` to connect to.  When connecting you have to options, (1) guess or (2) get the next number. And apperantly we have to guess a sequence of 10 numbers.

The first part I went through was to collect some data by sending many (2) requests to try to find some pattern by performing statistical analysis and number analyasis and I wrote the following code:

```python
import socket
import sys

file = open("numbers.txt", "w")
sock = socket.create_connection(('195.154.53.62', 7412))

try:
  for i in range(1,1000,1):
    data = sock.recv(256)
    number=data.split('\n', 1)[0]
    if "Guessed" not in number:
      print  number
      file.write("%s;" % (number))
    # Send data
    message = '2\n'
    sock.sendall(message)

finally:
    print >>sys.stderr, 'closing socket'
    sock.close()
```
At this point I got nothing after doing all my tricks of analysis. However, one of the other team mates tried to request a huge set of numbers after observing that the numbers are not more than 32 bits long. And then he noticed that the numbers eventually will repeat themselves in the same sequence. He wrote the following script and got the flag ``` ALEXCTF{f0cfad89693ec6787a75fa4e53d8bdb5}```

```python
#!/usr/bin/env python

from pwn import *
sock = remote('195.154.53.62', 7412)

nums = []

for i in range(32769):
        sock.send('2\n')

i = 0
p = log.progress('Reading numbers')
while True:
        while "2: Give me the next number" != sock.recvline(keepends = False):
            pass
        newnum = int(sock.recvline(keepends = False))
        if len(nums) > 0 and newnum == nums[0]:
            p.success("Found a match at i=%d" % i)
            break
        nums += [newnum]
        i+=1
        p.status("Read %d numbers" % i)

sock.clean()
log.info("Sending numbers %s" % nums[1:11])

p = log.progress('Sending numbers')
for i in range(10):
        n = nums[i+1]
        p.status("Sending number %d: %d" % (i, n))
        sock.send('1\n')
        sock.send('%d\n' % n)
p.success("Done")
log.info("Opening in interactive mode. Pray!")
sock.interactive()
```
