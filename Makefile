
h: # show any help that is available
	@/bin/bash jest.sh --help

c: # run local server to browse coverage
	@node server.js --log 15 --dir coverage

nt: # test .npmignore
	@npm pack

umd: # build browser UMD versions
	@node node_modules/.bin/webpack --config webpack-UMD.config.js

examples:
	rm -rf examples.es5.js
	node node_modules/.bin/webpack --config webpack-EXAMPLES.config.js
	node examples.es5.js

yarn:
	/bin/bash bash/swap-files-v2.sh package.json package.dev.json -- yarn --production=false


