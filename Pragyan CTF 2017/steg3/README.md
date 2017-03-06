## Lost Friends (300pts) 
By: [noras] from [ChalmersCTF](http://chalmersctf.se)

##### Challenge Description : 
```
Moana and her friends were out on a sea voyage, spending their summer joyously.
Unfortnately, they came across Charybdis, the sea monster. Charybdis, furious over having
unknown visitors, wreaked havoc on their ship. The ship was lost.

Luckily, Moana survived, and she was swept to a nearby island. But, since then, she has not seen her
friends. Moana has come to you for help. She believes that her friends are still alive, and that you are the
only one who can help her find them.

```
* File : [lost_friends.png](images/lost_friends.png)

#### Solution:

Opening the image with ***stegsolve*** revealed three images in the RGB channels.

![lost_friends.png](images/solved.png)

Running strings I found the hint that said 'Director Maybe?'. It was only about googling the director of ```Alvin and the Chipmunks``` and the flag was ```pragyanctf{MikeMitchell}```