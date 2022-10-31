u: # update npm and git (generates new tag)
	@/bin/bash update.sh

uf: # update even if there is nothing new committed
	@/bin/bash update.sh force

h: # show any help that is available
	@/bin/bash test.sh --help

t: # just run tests once
	@/bin/bash test.sh

tw: # run tests in watch mode
	@/bin/bash test.sh --watch

twa: # run tests in watchAll mode
	@/bin/bash test.sh --watchAll

c: # run local server to browse coverage
	@node server.js --log 15 --dir coverage

nt: # test .npmignore
	@npm pack

ck: # karma parameters.json
	@/bin/bash update.sh --karma

cp: # jest parameters.json
	@/bin/bash update.sh --prod

karma: # run karma test
	@/bin/bash karma.sh
	# /bin/bash karma.sh test/../file.test.js

umd: # build browser UMD versions
	@node node_modules/.bin/webpack --config webpack-UMD.config.js

examples:
	rm -rf examples.es5.js
	node node_modules/.bin/webpack --config webpack-EXAMPLES.config.js
	node examples.es5.js

yarn:
	/bin/bash bash/swap-files-v2.sh package.json package_karma.json -- yarn --production=false


