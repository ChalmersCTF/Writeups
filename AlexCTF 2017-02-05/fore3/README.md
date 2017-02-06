# Fore3: USB probing [150]
In this challenge we got a pcap with some usb traffic dump with the following message:
"*One of our agents managed to sniff important piece of data transferred transmitted via USB, he told us that this pcap file contains all what we need to recover the data can you find it ?*"

The first thing to do is to fireup wireshark and check  what kind of device is hooked up and apperantly it was a USB stick:
```
USB Mass Storage
    Signature: 0x43425355
    Tag: 0x00000a60
    DataTransferLength: 0
    Flags: 0x00
    .000 .... = Target: 0x0 (0)
    .... 0000 = LUN: 0x0
    ...0 0110 = CDB Length: 0x06
SCSI CDB Test Unit Ready
```
So now we know that we need to extract some kind of file data that was transfared. By sorting the packets according to thier size we could see that there where only few of them bigger than 4000 bytes. One of them had a png signature that looks like this:
```
 89 50 4e 47 0d 0a 1a 0a  00 00 00 0d 49 48 44 52   .PNG.... ....IHDR
```
Now it is just extracting the file by doing "Export packet bytes" we have a raw data file. By running file on it we can see that its indeed a PNG file, just put an extiention and open it in your favorite viewer and you have your flag `ALEXCTF{SN1FF_TH3_FL4G_0V3R_U58}`:

```console
root@kali:~/Downloads# file fore3.raw 
fore3.raw: PNG image data, 460 x 130, 8-bit/color RGBA, interlaced
root@kali:~/Downloads# mv fore3.raw fore3.png
```