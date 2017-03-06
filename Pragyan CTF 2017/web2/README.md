## Supreme Leader (150pts) 
By: [ChalmersCTF](http://chalmersctf.se)

##### Challenge Description : 
```

North Korea reportedly has a bioweapon in the making. Hack into their database and steal it.

Link : http://139.59.62.216/supreme_leader

NOTE :- Please enclose the flag in the format pragyanctf{<flag>}.

```


#### Solution:

Using burpsuite we could notice that there are two cookies getting set.

![cap](images/cap.png)

The first one does not apper when looking at the browser cookies because its getting over written have the value:

**2541d938b0a58946090d7abdde0d3890_b8e2e0e422cae4838fb788c891afb44**

Using [hashkiller ]( https://hashkiller.co.uk/md5-decrypter.aspx ) we got:

![hash](images/hash.png)

Since the description of the challenge said that we were supposed to hack the database, we were trying for a very long time to figure out how `send_nukes` was significant for the objective. A couple of hours later we simply entered the flag as `pragyanctf{send_nukes}` and it turned out to be correct...

**Flag:** ```pragyanctf{send_nukes}```