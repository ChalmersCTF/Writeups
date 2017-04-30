

# UIUCTF - Are we out of the woods yet?
##### 350 Points - Reversing

```
It looks like this python script was run through a custom packer. It's just Python*, which means it must be easy to reverse, right?

*v3.6.1:69c0db5

https://www.youtube.com/watch?v=y8qQsXpcZXA
```

This was fun little challenge that our team solved together. You are presented with the file `packed.py` that contains the following code:

```
import marshal, zlib, base64, itertools
def xor_strings(_left, _k):
    out = b''
    for l, r in zip(_left, itertools.cycle(_k)):
        out += (l ^ ord(r)).to_bytes(1, byteorder='big')
    return out

def YET_eval_code(p1, p2):
    YET_code = marshal.loads(zlib.decompress(xor_strings(base64.b64decode(p2), p1)))
    eval(YET_code)

YET_eval_code("YET", b'IdkZDw77+o1N7Di7tKvNdbcGSyxAHBQCMDw12oRMcF9ROnVSwvKV+QF5+XW7ro70gu6ab7p1grlxNvbOLDMNXJpNfMagxOrwCrApxe8WxToZJ7Fo1LSzaO87HkVHachzv7ItMwuLq4nI5KBzqkyYmZaLf6NnIUN7OjslBoVvqbufNX+mk6G33qpKTDwzrwa5znSK1ARqs3rO2ayzgCgJFhtzrHHI5AvrFfqYL9brp6R76oobxtoLPuobrJa/qtJ9aEzLRviUqpozgaGn9b3hZzzJ1FgKoTprUzpjRKSqPUKKnqypcv77hOlQN7ylvLtgXbyp8uUikn+fu6+qu7EatZvLH7uq+ItqZKMCuvnDFvQv9KrnFpScbLApQ5rzvHpzvIqSm7qtk+WAhTd2TpkrK46eFhAJX+wDZCEBRlup/oqHNuPrwtPrQYKrCr6g2qdj7DpI+NvQij9CZ5CbrA6st+SiLLcxby9KLuQqpn/anzjP1e/ypYJbrrLdDBPqTJoLu4lWjLgt0Uavp3AkxGmdEvL+h/+JhpwCvOvFCLBOIDWU5Hrv9FArJXczYHFSNTsZR2wWp7G0h7EoVnor9bu9rpE3mF6rCRZp5gyutPGoP4mykp7As1p3fKWQ2COHQwB1cBrTy93iUvdvyoDiNYlHZ2Fgcr8zuRc6dKx1WtF052zhQuxMwo1eZ61u0k9XhOJPfBYeJ/QGU3yfiN4IHmgMOXznCRLgRmul7B+DYKLbXOHAHjYfvV+7RSQ1FrzxfFt/NWpaRTzKHvUltc4s3JiC4SvJpYQ5AiLrcF079BsC4ktOKZBrAU5Ys7n2kCYn6sbNd5uOlOMdEJXmL6t0UNpi7aXv0ntvswTVEyDCkgb3cUwDSxBREu3SKkQ+TSAaq6G6MRkHle9k9bJp5FwGMZBY9Gy605jyH7O6vKd5IkLX82SVQt6UVYmz4DHtTTP5wvWn9yf7HAb8X5pB4e1eoZQWjrsm56SjGvoGSGpqkei8yG32OecHjq4i8rBJu5hA1RgedxkKk2eNkhQnB9E8n1rE631x8sh+iY7YBfOvrGja0tPWHU5lQw3oBCsndS4fuHOgqeBGQz3xOIN51f2VG9N6in8xKP3iPxWBFPEZMi+LRYByR/PdMBDcm2xgLS2dAX650nh3uf/nwR4okZAn5Kesl17aJFtxRH/wIeiewc5v/ma77CKa3sdEKB6QYXT8V6DzlI9AVLCwlY4wbGrQJ50FwaXCexviMm+SvK/mar/wg7R4n9DJkqQG9ttSOiD4JNGxlciIU+8l1yFvSIwx2lZv95BGkoeUJWtNeHwDjsze/d3pLJL5WS5uxGeQxSaRf33/ZQ3hC1ImnSOj7CvgCzX+ONPZ015B/DbPO4If9B0KSAIXMnZRvNDN3Vj6rRTaZIpG5ILBqMAAYP//GSoFybXk9TF/OvD0SuN6TYpXyA9LrTF5RN1aezlNzGbT+d2uLRxdh0CRjRPnXACEAIU8oz9X3DT8emRPIaSi7UZ2LXiwUjT7MNIfIv76rNNAAjc7M3+0umCXiRBn51xRkFA+jAe88B6ZY0z/gpCyrNeV+3bAKkPLAR0bslOTfh69TwE23FONJ9uw1OSnE/lfcY5fJUL/l/37lfhB/fbtciyOhw5dQbM+0h8FgAjc3OkxrlIpyW0PYTa0VTJPzmgnCQxpKwCnFEUd22j4Wv/t38NeqsAVdNB2sVUlPFSn4/ls9EW57sddKVwZBIK9QX577WWHsM+8C0b1bN/ebkyTxaIAguZ/35b0Tzcbh/UNScwgDbXKtjLGvu5mKG0GBFfcg3NkDnmF6YCxztszEwX72DinUfpAk3AhnIpSJMMco//VTrg2JiuHNPrtdfYpNiadE3dvIBQTqu/VNId0uYEaxEEGnWl6LoBGKLPVK6NpUM7gwZzTHMCUiTAtyXXQ2OCAi272ZFfkhc10+YwkguyQb+VT+VjZqmCJKn4HT/bOG4XoM5ROd36u5cvdWE7goOyetdbcgfdqoZB6cwUvqSqdAMuvOA6z7vtrI3dbLBj7sbv5DlYe2omV2tGhTy++usTqOBL9PutSEI6ebG+MMtkfB52mDRb0QYkykqfkm3Fdy6ODbJ96wYknnY0Qr52e5clvtLHJ4aCzzHNK+d/c4i0NuLYtUTliEBdROV535dzoPAPcl98gN0DsWFBAFmAsNEkOUFRhvP4kk3FT23/MGakbnm6a2IN7G6vgsl1yaQb9BQfODdtnh8SYkyVHqhUfYdh5LuNV3qYT7O2WSo33y8n3XBhQ/gSGAe7ALRNhfD3HQtgVcH2WyoL/kmRi/WohIfjf6MA2jPHPQckasFxwKVc5rwS6/N0F4EJAAkFYDiODN/29r5uMQtnjtB/6gdZNT/Umjr8QkdRFgCKwX2mB/K1kf+5AZfIATOgZ9+gAd0/veeClPhYU7m6D99OS7zctg4NR8LCivwxjPI4UcfuTqf3i2Dk5ebw+Y35RKdwSkRgJxHMh13GeoPPuW1S90qYsyfGDg6KCgBt6qyP60lX/BbNOASutLMLxnQBZgNkISVfVsuz2vUlAWsq0E4ZEqd+JoOn6BkRQvpQ9Ltb0o8nEwj0jjEpyXMZ56RMXEay0IyG5WvJD1309fKdyTlidj74Hw/B8yEeK3CvPVCwsvsQlvIbeVxnqCN1SE1LDa5Q2dEO0H9CP9Brs9F9Afr182V0/XNkyghuLvPOEatSbo86KO8DI+flZ80gIBZ09DD2Ojxoy+Bz73L8UQV3mAUV8kbYuMA02J34BSFX8qhAhM+ACgjtT7JnFgt3x9Bz0h0SJZl3VxhrcK/Ynqw1pAEHE2exvnVRhX9tNTibRXhA/LZEc0xholsdG73ZG4xi4I2s7DnidKX0w1jLXPaXIuRP5esIV2ygPM1j1veSroeuovIaOpa9V5jyUokJoJZfPzrzForzrXL+k/mFXFKkqorXEjIbKpzuuuJjTvrpWCUQt2Q==')
```

We could quickly deduce that there was an embedded python program encoded with base64. In order to reveal the program we decompiled `YET_code` variable with [dis](https://docs.python.org/3/library/dis.html "Disassembler for Python bytecode").


```
import dis
print(dis.disassemble(YET_code))
```

This revealed more embedded data:

```
1           0 LOAD_CONST               0 (0)
            2 LOAD_CONST               1 (None)
            4 IMPORT_NAME              0 (marshal)
            6 STORE_NAME               0 (marshal)
            8 LOAD_CONST               0 (0)
           10 LOAD_CONST               1 (None)
           12 IMPORT_NAME              1 (zlib)
           14 STORE_NAME               1 (zlib)
           16 LOAD_CONST               0 (0)
           18 LOAD_CONST               1 (None)
           20 IMPORT_NAME              2 (base64)
           22 STORE_NAME               2 (base64)
           24 LOAD_CONST               0 (0)
           26 LOAD_CONST               1 (None)
           28 IMPORT_NAME              3 (itertools)
           30 STORE_NAME               3 (itertools)

2          32 LOAD_CONST               2 (<code object xor_strings at 0x10f9fbf60, file "YETpacked", line 2>)
           34 LOAD_CONST               3 ('xor_strings')
           36 MAKE_FUNCTION            0
           38 STORE_NAME               4 (xor_strings)

8          40 LOAD_CONST               4 (<code object CLEAR_eval_code at 0x10fa38930, file "YETpacked", line 8>)
           42 LOAD_CONST               5 ('CLEAR_eval_code')
           44 MAKE_FUNCTION            0
           46 STORE_NAME               5 (CLEAR_eval_code)

12          48 LOAD_NAME                5 (CLEAR_eval_code)
           50 LOAD_CONST               6 ('CLEAR')
           52 LOAD_CONST               7 (b'O9AIFJnt551Qp6jQPnv/CwUCqBruZM9zmFJPhUdeEetQWjHdSilxStekT7JmRS9zWWJ5OzFyn8SoSrN/3SqRop5xRtkvd/7pH/T3Fhj096TttpKhdSiQnN5paPKugUk7jyEhraPLs7GPzKCU+k2YLyql37x69WaMhzevvcG8qHg6TX3Dw1z9ThIa/71whquplZ8D2HwlBbu8unCdvJbpc4mNnuFOhe/yoLWiq5QropRzuSSmKrAss2Q5V9Ki5YqrpCNCDLYfn7as77yhgWuzn13uzvZPDqD8t4GeXXg0yc71szm9ubA7Y7hNKn00ODvemJ+wsJfquATYNwq9PTO9La56h0+8NGzy3T4glIRvPgC54S7Pctt6vBVyw4gxS7J0Qe2rXrqmGRkuU/r5oNI4rqMm38TOF0oC0vG6xllqvE1Pa4Yu1PxXx+7ovrOxzy2XsOu23V7YxjkKza40eHvcrqIfvZistukBntEGuLPulzBmZas4SKSF1IvClVMGqGHO9Wc/+aNjKt+WsKNwgzLypkmw5zn9tTR7e9cMLNgvUKh1ij4ev4YMH5W1pM83ZPYTMc+rm3+qOyzDE7OerP9rv6El9RsXDYymsDNJ7KrweK9QyTMzY3Y6h5JKZ8RvOTYUkRbmPC0u9ADKvVmaa7d++QYjC+T6mT4n7bBe6vO2VWFn4A+KJPuiUTNdnVrWOp4bJGtWYvQiMt2JJkqxEkn+bEJAIFSagqlkzvbHqEgroQ7IfFLRlggaPgD2HwhOnSLe3iWv5dmN2RSw3Y3/FmHtqSggdkTFIWn6QIHw1AhR5RkcAEHtMX3OgX57TvVbOSOWJdHVW681jljW4jJigjBMDdP1fIp/PGVVXXvxf6WvCPvCGZVWdNl0HHFsukzvE1Rs5atOjgTBVaMO3xfbNWrH7kU1pKYNma7yFWaKNmBQxikPs5qoG+mpuYWNSlDiEagihc7sU9hS+g31WJpeQVVGgnA22gtaE3EoxOlOovJGXWzQEbOUKdU2w8eJrpdsQy4f5p8i1QObO6iFufjYT2NqYE0Sqiw4P3aA+trXcvO1GBOZd9R5neccwHbpqVioWFsAwnY4FVFEl8mKHU+Evy53HKV1v1eMgz8/AmQLS9yNyDQghTRAIqnWQOAtbY7ePMF2aKpXyNHrdF6dbxgAhrOr6Ef9UYFU1CFf82/y/GUvnBy8X0oGyb7m3QZwR/tk+su2bAYA2mbncm1SPolrDq04cGiSUNgQ7kVlHGjqs421f0IQ74H2QnaWsAvLA2RuPdiFCjBwTABiFzdVLYUXnGKDZRPotE4d+sv5t2rwFU6lAz7iV+MsobMP4bRWzhsDkqdvIhxmURlyzBFpxyyLgRN1wwySWhxyTmEV1Zzg1S6B1utLIFx7fQyHfYCFRSfkqJflpQgjvNEuq572Jo0qI37VQ1Q+f65v/HogcPkZ4G73ZXwnYcywPBN+sV8eJTmPDk0s9++jdhJmmnSd78YjxZNaZk4WJZFpai9Y1qENEm9tYzVr1AtEhe2nHuIAEIZdPyMLf9KduhqjKMDwHHiZjQr01VQrUoNc1ZsYJmZItQ9Fo0DZY2jSag/sjMdpkrClk/FqiMzQVJarQWJTZQ28pYwYES94NCLfeK4b1W0W26Dl7/SatFemYHWEWo1OKQFZyipgn7YseI57/iHKrofwzxWbGYGYKgBwvKqGCo7iJRwvhAjKCkCyoC8d0T0PcHZJSqNK0TSVvmfvQr/qbqCQ3Fhq1xfKv30YBseNFb9OQvgGZMWZRaY4ENy79ltbdRfu1RfZcDSdKoVARwtsM8tp4uSUx3fdP4yqLwwyFgvbUvcBXXR8+WP1JSXGVd0BN6w7nAXTjJpC/AQA9WnSSpH1ldgAKrYYO9tJDhJWWfd12pkMDxQ1tU4C8lDfWIZE2dBda3zjEWdfLJbIKGOL9CamP8pPcQbWyMnov5AndNe1x88CYgUzHeRI3FieNuSHu1n/XrmVlVlddxErBBhqevTiqM2LOdl7vO9FJvyWDpbOyHkhJh/yaJOpAEg85VzKlqbnsqgVBh0ojZt6OtIAY74//d1ippt0YQPpxMskdOEUfTctStTvyD1vKLK8ZrbVadtDdWhIYihpXAr8DcpkTMaAdQdZWcAL5YzNHdOE7qg1s65fLJCPwl+oir2boC1xXbt+RB3yCHK91bSatCH2pAK3vcRjim7BvE6k5CIy')
           54 CALL_FUNCTION            2
           56 POP_TOP
           58 LOAD_CONST               1 (None)
           60 RETURN_VALUE
None
```

By substituting the `YET_eval_code` function call with the key `CLEAR` and with the above base64 encoded data, we get an other embedded python program. This process continues 3 more times until we reach the last and final program. This is how it looks like disassembled:

```
1           0 LOAD_CONST               0 (1338)
            2 STORE_NAME               0 (x0)

2           4 LOAD_CONST               1 (413)
            6 STORE_NAME               1 (x1)

3           8 LOAD_CONST               2 (3.5699)
           10 STORE_NAME               2 (r)

4          12 LOAD_NAME                0 (x0)
           14 STORE_NAME               3 (xn)

5          16 LOAD_NAME                1 (x1)
           18 STORE_NAME               4 (xk)

7          20 LOAD_CONST               3 ('')
           22 STORE_NAME               5 (accumulated)

9          24 LOAD_NAME                6 (input)
           26 LOAD_CONST               4 ('I N P U T: ')
           28 CALL_FUNCTION            1
           30 STORE_NAME               7 (user)

10          32 SETUP_EXCEPT            14 (to 48)

11          34 LOAD_NAME                8 (bytes)
           36 LOAD_ATTR                9 (fromhex)
           38 LOAD_NAME                7 (user)
           40 CALL_FUNCTION            1
           42 STORE_NAME               7 (user)
           44 POP_BLOCK
           46 JUMP_FORWARD            36 (to 84)

12     >>   48 DUP_TOP
           50 LOAD_NAME               10 (ValueError)
           52 COMPARE_OP              10 (exception match)
           54 POP_JUMP_IF_FALSE       82
           56 POP_TOP
           58 POP_TOP
           60 POP_TOP

13          62 LOAD_NAME               11 (print)
           64 LOAD_CONST               5 ('Non-hex byte entered!')
           66 CALL_FUNCTION            1
           68 POP_TOP

14          70 LOAD_NAME               12 (exit)
           72 LOAD_CONST              14 (-1)
           74 CALL_FUNCTION            1
           76 POP_TOP
           78 POP_EXCEPT
           80 JUMP_FORWARD             2 (to 84)
      >>   82 END_FINALLY

15     >>   84 LOAD_CONST               7 (b'\x8b*<LH~\xdc\xc4\xfc\xad\xff9\xe8h\x8d^\xf2\xc3\xa7\xc9&\x8f \xeaE_\xb0T\x05\xe5\xff\x9cD\x9e\x84\x13k\x0f~\xb5\x9cUm\x08\\')
           86 STORE_NAME              13 (flag)

16          88 SETUP_LOOP             152 (to 242)
           90 LOAD_NAME               14 (zip)
           92 LOAD_NAME               13 (flag)
           94 LOAD_NAME                7 (user)
           96 CALL_FUNCTION            2
           98 GET_ITER
      >>  100 FOR_ITER               138 (to 240)
          102 UNPACK_SEQUENCE          2
          104 STORE_NAME              15 (flagchar)
          106 STORE_NAME              16 (userchar)

17         108 LOAD_NAME                2 (r)
          110 LOAD_NAME                3 (xn)
          112 BINARY_MULTIPLY
          114 LOAD_CONST               6 (1)
          116 LOAD_NAME                3 (xn)
          118 BINARY_SUBTRACT
          120 BINARY_MULTIPLY
          122 LOAD_NAME                0 (x0)
          124 BINARY_MODULO
          126 STORE_NAME               3 (xn)

18         128 LOAD_NAME               17 (int)
          130 LOAD_NAME                3 (xn)
          132 LOAD_CONST              15 (100)
          134 BINARY_MULTIPLY
          136 CALL_FUNCTION            1
          138 LOAD_CONST              10 (255)
          140 BINARY_MODULO
          142 STORE_NAME               3 (xn)

20         144 LOAD_NAME                2 (r)
          146 LOAD_NAME                4 (xk)
          148 BINARY_MULTIPLY
          150 LOAD_CONST               6 (1)
          152 LOAD_NAME                4 (xk)
          154 BINARY_SUBTRACT
          156 BINARY_MULTIPLY
          158 LOAD_NAME                1 (x1)
          160 BINARY_MODULO
          162 STORE_NAME               4 (xk)

21         164 LOAD_NAME               17 (int)
          166 LOAD_NAME                4 (xk)
          168 LOAD_CONST              16 (100)
          170 BINARY_MULTIPLY
          172 CALL_FUNCTION            1
          174 LOAD_CONST              10 (255)
          176 BINARY_MODULO
          178 STORE_NAME               4 (xk)

23         180 LOAD_NAME               18 (chr)
          182 LOAD_NAME                3 (xn)
          184 LOAD_NAME               15 (flagchar)
          186 BINARY_XOR
          188 CALL_FUNCTION            1
          190 STORE_NAME              19 (flagbyte)

24         192 LOAD_NAME               18 (chr)
          194 LOAD_NAME                4 (xk)
          196 LOAD_NAME               16 (userchar)
          198 BINARY_XOR
          200 CALL_FUNCTION            1
          202 STORE_NAME              20 (userbyte)

26         204 LOAD_NAME               19 (flagbyte)
          206 LOAD_NAME               20 (userbyte)
          208 COMPARE_OP               3 (!=)
          210 POP_JUMP_IF_FALSE      230

27         212 LOAD_NAME               11 (print)
          214 LOAD_CONST              11 ('Still in the woods')
          216 CALL_FUNCTION            1
          218 POP_TOP

28         220 LOAD_NAME               12 (exit)
          222 LOAD_CONST              17 (-1)
          224 CALL_FUNCTION            1
          226 POP_TOP
          228 JUMP_ABSOLUTE          100

30     >>  230 LOAD_NAME                5 (accumulated)
          232 LOAD_NAME               20 (userbyte)
          234 INPLACE_ADD
          236 STORE_NAME               5 (accumulated)
          238 JUMP_ABSOLUTE          100
      >>  240 POP_BLOCK

32     >>  242 LOAD_NAME               11 (print)
          244 LOAD_CONST              12 ('Looking at it now, it all seems so simple:')
          246 LOAD_NAME                5 (accumulated)
          248 CALL_FUNCTION            2
          250 POP_TOP
          252 LOAD_CONST              13 (None)
          254 RETURN_VALUE
None
```

We managed to reverse engineer the above output into the following python source:

```
import sys

x0 = 1338
x1 = 413
r = 3.5699
xn = x0
xk = x1

accumulated = ''

#user = input("I N P U T: ")
# user = bytes.fromhex(user)
# if not user:
#     print('Non-hex byte entered!')
#     sys.exit()


flag = b'\x8b*<LH~\xdc\xc4\xfc\xad\xff9\xe8h\x8d^\xf2\xc3\xa7\xc9&\x8f \xeaE_\xb0T\x05\xe5\xff\x9cD\x9e\x84\x13k\x0f~\xb5\x9cUm\x08\\'

for flagchar in flag:
    xn = ((r * xn) * (1 - xn)) % x0
    xn = int(xn * 100) % 255

    #xk = ((xk * r) * (1 - xk)) % x1
    #xk = (int(xk * 100)) % 255

    flagbyte = chr(xn ^ flagchar)
    #userbyte = chr(xk ^ userchar)

    # if flagbyte != userbyte:
    #     print('Still in the woods')
    #     sys.exit()
    # else:
    accumulated += flagbyte

print('Looking at it now, it all seems so simple: {}'.format(accumulated))


```
Which revealed `Looking at it now, it all seems so simple: flag{th3_m0nst3rs_turned_0ut_2_be_ju5t_tr33s}`
