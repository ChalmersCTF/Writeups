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

# Looking at it now, it all seems so simple: flag{th3_m0nst3rs_turned_0ut_2_be_ju5t_tr33s}
