types:
	npx tsc -p . --noEmit

lint:
	npx tslint -p . --format stylish

unit:
	npx jest

test: types lint unit

start:
	node -r ts-node/register/transpile-only src/index.ts
