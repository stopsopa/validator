u:
	npm version patch
	npm publish --access=public
	git push origin master --tags

t:
	@/bin/bash test.sh