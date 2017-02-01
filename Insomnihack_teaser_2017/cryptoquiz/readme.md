# Insomni'hack teaser - Cryptoquizz (crypto/misc 50)
This was an interesting challange. You started by connecting with telnet to the server specified in the challenge description. Once connected, a question was asked: What is the birth year of [known cryptographer]? You had 2 seconds to react before the server disconnected you. Once you connected again, the server asked the same question but for a different person. I begun connecting over and over again to see if there was a pattern or if the selection of people was small. I came to the conclusion that the server was selecting randomly from a list consiting of 20+ names.

I looked up some of the names to see which year they were born, then I began connecting again hoping that the name I looked up would show. To my suprise the name came up pretty fast, so I entered the birth year but I was given no flag. Instead, a new name was asked.

I concluded the following:

- The server is selecting known cryptographers from a list consisting of 20+ names.
- If you enter the wrong birth year, the server will disconnect you.
- If you enter the correct birth year, the server will ask the same question but for a different person.
- The server will most likely ask you a specific number of times before you are given a flag.

## Search all the things!
I thought that there are two ways to solve this challenge.

#### a) Manually
Connect to the server as much as I need until I have written down the names, then manually search for their birth years. Create a script and hardcode the names and their birth years and simply return the correct birth year for the person in the question.

I didn't like this approach, it was tedious and didn't really require any significant effort.

#### b) Automatic
Instead I choose the automatic approach. I created a script that connected to the server, parsed out the name from the question asked by the server. The script makes one query to google to see if google returns a profile with the birth year. If not, the script falls back to wikipedia.

The problem with this approach is that not all entries on google and wikipedia have the same format when showing when someone was born. Therefore it required a lot of regular expressions. It was very much trial and error building this script but it got me the flag and it was fun as well.

## The script
```python
#!../venv/bin/python
# -*- coding: utf-8 -*-
from pwn import *
import requests
import re
from bs4 import BeautifulSoup

url = 'https://en.wikipedia.org/wiki/'
url2 = 'https://www.google.se/search?q='

new_data = ""
conn = remote('quizz.teaser.insomnihack.ch',1031)
print conn.recv()
data = conn.recv()

while True:
    if new_data:
        findName = re.search("~~ What is the birth year of(\s[\w\-\.\s]+)\?", new_data)
        print(new_data)
    else:
        findName = re.search("~~ What is the birth year of(\s[\w\-\.\s]+)\?", data)
        print(data)

    try:
        print("Name: "+findName.group(1))
        name = findName.group(1)
    except Exception as e:
        if new_data:
            print(new_data)
        else:
            print(data)
        print("[-] Could not find name")
        quit()

    wikipediaurl = url+name.strip().replace(' ','_')
    googleurl = url2+name.strip()

    print("Wikipedia URL: " + wikipediaurl)
    print("Google URL: " + googleurl)

    request = requests.get(googleurl)
    soup = BeautifulSoup(request.text, 'html.parser')
    born = soup.body.find('span', attrs={'class': '_tA'})

    wikipedia_search = [
            '<span class="bday">(\d{4}).+<\/span>',
            '.+born \w+ \d{2}\, (\d{4}).+',
            '.+born (\d{4}).+',
            '.+born \d{1,2} \w+ (\d{4}).+',
            '.+born \<abbr.+ (\d{4}).+',
            '<th scope="row">Born<\/th>\n<td>(\d{4})<\/td>',
            '.+\(\w+ \d{1,2}\,\s(\d{4}) \- \w+ \d{1,2}\, \d{4}.+',
    ]

    googlesearch = [
        '<span class="_tA">\d{1,2} \w+ (\d{4}).+',
        '<span class="_tA">(\d{4}).+',
        '.Född\<\/a\>\: \<\/span\>\<span class="_Xbe kno-fv">\d{1,2} \w+ (\d{4}) \(ålder \d{1,2}\)',
        '.Född<\/a>: <\/span>\<span class="_Xbe kno-fv">(\d{4}).+',
    ]

    for index in xrange(len(googlesearch)):

        getBirth = re.search(str(googlesearch[index]), str(born))

        try:
            print("[google] Found Birth year: "+getBirth.group(1))
            birthYear = getBirth.group(1)
            break
        except Exception as e:
            print("[-] Could not find birth year for google search %d" % (index))

        if index+1 == len(googlesearch):
            print("[*] Could not find birth year using google, trying wikipedia\n")
            
            # Try wikipedia
            request = requests.get(wikipediaurl)
            for index in xrange(len(wikipedia_search)):
                getBirth = re.search(wikipedia_search[index], request.content)

                try:
                    print("[wikipedia] Birth year: "+getBirth.group(1))
                    birthYear = getBirth.group(1)
                    break
                except Exception as e:
                    print("[-] Could not find birth year for wikipedia search %d" % (index))

                    if index+1 == len(wikipedia_search):
                        print("Could not find birth year at all. Quiting...")
                        quit()

    conn.send(birthYear+"\r\n")
    data = conn.recv()
    new_data = data
    print(conn.recv())
```

### Output
```
(venv)λ ~/Desktop/insomnia/cryptoquiz/ python hack.py
[+] Opening connection to quizz.teaser.insomnihack.ch on port 1031: Done

-~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
~~ Hello, young hacker. Are you ready to fight rogue machines ?    ~~
~~ Now, you'll have to prove us that you are a genuine             ~~
~~ cryptographer.                                                  ~~
-~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



~~ What is the birth year of Dan Boneh ?


Name:  Dan Boneh
Wikipedia URL: https://en.wikipedia.org/wiki/Dan_Boneh
Google URL: https://www.google.se/search?q=Dan Boneh
[-] Could not find birth year for google search 0
[google] Found Birth year: 1969



~~ What is the birth year of Nigel P. Smart ?

Name:  Nigel P. Smart
Wikipedia URL: https://en.wikipedia.org/wiki/Nigel_P._Smart
Google URL: https://www.google.se/search?q=Nigel P. Smart
[google] Found Birth year: 1967



~~ What is the birth year of Yehuda Lindell ?

Name:  Yehuda Lindell
Wikipedia URL: https://en.wikipedia.org/wiki/Yehuda_Lindell
Google URL: https://www.google.se/search?q=Yehuda Lindell
[google] Found Birth year: 1971



~~ What is the birth year of Moni Naor ?

Name:  Moni Naor
Wikipedia URL: https://en.wikipedia.org/wiki/Moni_Naor
Google URL: https://www.google.se/search?q=Moni Naor
[google] Found Birth year: 1961



~~ What is the birth year of Ronald Cramer ?

Name:  Ronald Cramer
Wikipedia URL: https://en.wikipedia.org/wiki/Ronald_Cramer
Google URL: https://www.google.se/search?q=Ronald Cramer
[google] Found Birth year: 1968



~~ What is the birth year of Ross Anderson ?

Name:  Ross Anderson
Wikipedia URL: https://en.wikipedia.org/wiki/Ross_Anderson
Google URL: https://www.google.se/search?q=Ross Anderson
[google] Found Birth year: 1956



~~ What is the birth year of Michael O. Rabin ?

Name:  Michael O. Rabin
Wikipedia URL: https://en.wikipedia.org/wiki/Michael_O._Rabin
Google URL: https://www.google.se/search?q=Michael O. Rabin
[google] Found Birth year: 1931



~~ What is the birth year of Jacques Patarin ?

Name:  Jacques Patarin
Wikipedia URL: https://en.wikipedia.org/wiki/Jacques_Patarin
Google URL: https://www.google.se/search?q=Jacques Patarin
[-] Could not find birth year for google search 0
[-] Could not find birth year for google search 1
[-] Could not find birth year for google search 2
[-] Could not find birth year for google search 3
[*] Could not find birth year using google, trying wikipedia

[-] Could not find birth year for wikipedia search 0
[-] Could not find birth year for wikipedia search 1
[-] Could not find birth year for wikipedia search 2
[-] Could not find birth year for wikipedia search 3
[-] Could not find birth year for wikipedia search 4
[-] Could not find birth year for wikipedia search 5
[-] Could not find birth year for wikipedia search 6
Could not find birth year at all. Quiting...



(venv)λ ~/Desktop/insomnia/cryptoquiz/ python hack.py
[+] Opening connection to quizz.teaser.insomnihack.ch on port 1031: Done

-~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
~~ Hello, young hacker. Are you ready to fight rogue machines ?    ~~
~~ Now, you'll have to prove us that you are a genuine             ~~
~~ cryptographer.                                                  ~~
-~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



~~ What is the birth year of Victor S. Miller ?


Name:  Victor S. Miller
Wikipedia URL: https://en.wikipedia.org/wiki/Victor_S._Miller
Google URL: https://www.google.se/search?q=Victor S. Miller
[google] Found Birth year: 1947



~~ What is the birth year of Ronald Cramer ?

Name:  Ronald Cramer
Wikipedia URL: https://en.wikipedia.org/wiki/Ronald_Cramer
Google URL: https://www.google.se/search?q=Ronald Cramer
[google] Found Birth year: 1968



~~ What is the birth year of Joan Daemen ?

Name:  Joan Daemen
Wikipedia URL: https://en.wikipedia.org/wiki/Joan_Daemen
Google URL: https://www.google.se/search?q=Joan Daemen
[-] Could not find birth year for google search 0
[google] Found Birth year: 1965



~~ What is the birth year of Martin Hellman ?

Name:  Martin Hellman
Wikipedia URL: https://en.wikipedia.org/wiki/Martin_Hellman
Google URL: https://www.google.se/search?q=Martin Hellman
[google] Found Birth year: 1945



~~ What is the birth year of Arjen K. Lenstra ?

Name:  Arjen K. Lenstra
Wikipedia URL: https://en.wikipedia.org/wiki/Arjen_K._Lenstra
Google URL: https://www.google.se/search?q=Arjen K. Lenstra
[google] Found Birth year: 1956



~~ What is the birth year of Dan Boneh ?

Name:  Dan Boneh
Wikipedia URL: https://en.wikipedia.org/wiki/Dan_Boneh
Google URL: https://www.google.se/search?q=Dan Boneh
[-] Could not find birth year for google search 0
[google] Found Birth year: 1969



~~ What is the birth year of Phil Rogaway ?

Name:  Phil Rogaway
Wikipedia URL: https://en.wikipedia.org/wiki/Phil_Rogaway
Google URL: https://www.google.se/search?q=Phil Rogaway
[-] Could not find birth year for google search 0
[google] Found Birth year: 1962



~~ What is the birth year of Yehuda Lindell ?

Name:  Yehuda Lindell
Wikipedia URL: https://en.wikipedia.org/wiki/Yehuda_Lindell
Google URL: https://www.google.se/search?q=Yehuda Lindell
[google] Found Birth year: 1971



-~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
~~ OK, young hacker. You are now considered to be a                ~~
~~ INS{GENUINE_CRYPTOGRAPHER_BUT_NOT_YET_A_PROVEN_SKILLED_ONE}     ~~
-~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

[-] Could not find name
[*] Closed connection to quizz.teaser.insomnihack.ch port 1031
```