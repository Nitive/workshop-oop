install:
	npm install

types:
	npx tsc -p . --noEmit

lint:
	npx tslint -p . --format stylish

unit:
	npx jest

test: types lint unit

usage-example:
	bin/convert-feed -o rss https://ru.hexlet.io/lessons.rss
