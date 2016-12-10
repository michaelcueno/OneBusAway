all: 
	zip -r Archive.zip *

clean: 
	rm Archive.zip

test: 
	node test.js
