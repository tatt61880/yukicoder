
all: vendor yukicoder.exe
	yukicoder.exe

vendor:
	composer update

yukicoder.exe:
	kuincl.exe -i yukicoder.kn -o yukicoder.exe
