u: # update npm and git (generates new tag)
	@/bin/bash update.sh

uf: # update even if there is nothing new committed
	@/bin/bash update.sh force

h: # show any help that is available
	@/bin/bash test.sh --help

t: # just run tests once
	@/bin/bash test.sh

tw: # run tests in watch mode
	@/bin/bash test.sh --watchAll
	# @/bin/bash test.sh --watch

c: # run local server to browse coverage
	node server.js --log 15 --dir coverage

nt: # test .npmignore
	npm pack
