
# add tag:
#     git tag test-tag
# remove tag:
#     git tag -d test-tag

# push tag (remote):

# delete remote tag
#     git push origin --delete tag name

# script return tag attached to CURRENT/LAST commit

git tag -l --points-at HEAD

# or: from: https://gist.github.com/rponte/fdc0724dd984088606b0
# return latest tag from all (not precise)
#git describe --abbrev=0 --tags