### CR4:Poor RSA [200]
In this challenge we have a RSA public and a cipher text that we need to decypt.
Since we know that RSA is broken only if we can factorize the modulus then thats is apperantly the goal.

To extract the modulus we use openssl to extract that information:

```sh
openssl rsa -noout -text -inform PEM -in key.pub -pubin
Public-Key: (399 bit)
Modulus:
    52:a9:9e:24:9e:e7:cf:3c:0c:bf:96:3a:00:96:61:
    77:2b:c9:cd:f6:e1:e3:fb:fc:6e:44:a0:7a:5e:0f:
    89:44:57:a9:f8:1c:3a:e1:32:ac:56:83:d3:5b:28:
    ba:5c:32:42:43
Exponent: 65537 (0x10001)
52a99e249ee7cf3c0cbf963a009661772bc9cdf6e1e3fbfc6e44a07a5e0f894457a9f81c3ae132ac5683d35b28ba5c324243
```

To get the integer representation we run the following:
```python
python -c "print int('52a99e249ee7cf3c0cbf963a009661772bc9cdf6e1e3fbfc6e44a07a5e0f894457a9f81c3ae132ac5683d35b28ba5c324243',16)"

833810193564967701912362955539789451139872863794534923259743419423089229206473091408403560311191545764221310666338878019
```

Now we do the factorization using the online service by factordb.com:

http://www.factordb.com/index.php?query=833810193564967701912362955539789451139872863794534923259743419423089229206473091408403560311191545764221310666338878019

we get the factors p and q:

p=863653476616376575308866344984576466644942572246900013156919
q=965445304326998194798282228842484732438457170595999523426901


We decode the base64 flag to assci:
```sh
cat flag.b64 | base64 -d >flag.assci
```
And decrypt it using openssl:
```sh
openssl rsautl -decrypt -inkey priv.key < flag.assci > decrypted
cat decrypted 
ALEXCTF{SMALL_PRIMES_ARE_BAD}
```
