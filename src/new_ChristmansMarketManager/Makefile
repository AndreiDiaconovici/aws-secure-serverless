.PHONY: build-newChristmasMarketManager

build-newChristmasMarketManager:
	rm -rf node_modules
	rm -rf package-lock.json
	npm install
	npm run-script build
	cp -a dist/* "$(ARTIFACTS_DIR)"