### Programing1 [200]
Challenge: "We unearthed this text file from one of the older servers and want to know what this is all about. Could you please analyse this and let us know your finding?" and there is a text file attached

I have a quick look at the file and I have a quick guess that its an RGB array because the 3 elemnts tuples are bounded by 255 --> FF.

I need now to guess the width and the heigth of the image because the values are stuffed in an one dimentional list. The total 3 elements tuples count were ```528601``` knowing this the dimentions are two numbers the divides this.

The devisors of this number are:
```
1   569   929   528601
```

I write my script and I have the flag!!
```python
from PIL import Image
import numpy

pixels=open("abc.txt").read()
myPixelsArray=tuple(eval(pixels))

# len(myPixelsArray)---> 528601
# 528601 divisors   ---> 569 929
myImage = Image.new("RGB", (929, 569))

myImage.putdata(myPixelsArray)

myImage.save("flag.jpg")

```

![flag](images/flag.jpg)

