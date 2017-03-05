import string

def extractPossibilities(bindexs,r=0):
	starts=[]
	for bindex in bindexs:
		suma=0
		for i in range(bindex+1,len(cipher),1):
			suma=sum(cipher[bindex:i])
			if suma in caps_xor_61:
				
				starts.append(i)
				if r==1:
					addRoute(bindex,i,chr(suma^61))
	return starts


def addRoute(start,end,ch):
	p={'start':start,'end':end,'ch':ch}
	if p not in routes:
		routes.append(p)
		print str(start)+':'+str(end)+ '\t\t' +ch

	
def getCh(start,end):
	for r in routes:
		if r['start']==start and r['end']==end:
			return r['ch']


routes=[]
flags=[{'end':0,'flag':''}]

caps= range(65,91,1)#string.ascii_uppercase #65-90

caps_xor_61=[124,127,126,121,120,123,122,117,116,119,118,113,112,115,114,109,108,111,110,105,104,107,106,101,100,103,70,64]

cipher=[26,25,30,28,22,25,20,23,21,29,22,24,26,23,21,26,27,20,28,22,25,23,30,29,23,28,24,20,21,26,25,20,23,27,23,29,25,22,23,26,27,29,24,23,30,21,25,24,26,20,24,22,21,30,26,20,25,24,21,23,27,29,26,22,20,21,23,22,30,26,29,26,28,27,22,20,27,29,26,30,28,27,26,23,29,21,22,25,27,24,21,29,25,24,20,25,23,22,30,28,27,29,25,20,24,21,23,20,23,21,29,26]

bindexs=[0]
#build the tree
while bindexs:
	bindexs=extractPossibilities(bindexs,1)





