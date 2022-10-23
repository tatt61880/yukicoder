all: vendor yukicoder.exe node_modules
	npm run eslint
	npm run htmlhint
	npm run stylelint

node_modules:
	npm install

vendor:
	composer update

yukicoder.exe:
	kuincl.exe -i yukicoder.kn -o yukicoder.exe
