import numpy as np
q=541
g=10

alist=[]
aplus=[]
gaplus=[]
for a in range(1,1000,1):
  if(a<3):
    v=np.power(g,a)%q
    alist.append(v)
  else:
    v=(alist[a-2]*g)%q
    alist.append(v)
  if v==298:
    aplus.append(a)
    gaplus.append(v)
print "a values"
print aplus
print "g^a values"
print gaplus

blist=[]
bplus=[]
gbplus=[]
for b in range(1,1000,1):
  if(b<3):
    v=np.power(g,b)%q
    blist.append(v)
  else:
    v=(blist[b-2]*g)%q
    blist.append(v)
  if v==330:
    bplus.append(b)
    gbplus.append(v)
print "b values"
print bplus
print "g^b values"
print gbplus
gabplus=[]
for i in range(0,len(aplus),1):
  for j in range(0,len(bplus),1):
    for pw in range(1,bplus[j],1):
      if(pw<3):
        v=np.power(gaplus[i],pw)%q
        gabplus.append(v)
      else:
        v=(gabplus[pw-2]*gaplus[i])%q
        gabplus.append(v)
      if(v==399):
        print "flag{"+str(aplus[i])+","+str(bplus[j])+"}"


