from PIL import Image
import numpy

pixels=open("abc.txt").read()
myPixelsArray=tuple(eval(pixels))

# len(myPixelsArray)---> 528601
# 528601 divisors   ---> 569 929
myImage = Image.new("RGB", (929, 569))

myImage.putdata(myPixelsArray)

myImage.save("flag.jpg")
