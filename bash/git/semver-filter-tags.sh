
# filtering example
#cat <<EOF | sed -nE "/[0-9]+\.[0-9]+\.[0-9]+$/p"
#v0.1.67
#v0.0.5
#v1.10
#project-4.5.2-dev
#v0.0.4
#project-4.56.3-dev
#v0.0.3
#project-4.56.4-dev
#v0.0.2
#EOF

# desired format
#cat <<EOF | /bin/bash bash/git/semver-filter-tags.sh "project-56.4.0-dev"
#v0.1.67
#v0.0.5
#project-4.5.2-dev
#project-4.5.2-dav
#project-4.2-dav
#v0.0.4
#project-4.56.3-dev
#project-4.5..2-dav
#v0.0.3
#project-4.56.4-dev
#project-.5.2-dav
#v0.0.2
# project-0.5.2-dev
#EOF

# desired format NOT MATCHING
#cat <<EOF | /bin/bash bash/git/semver-filter-tags.sh --not "project-56.4.0-dev"
#v0.1.67
#v0.0.5
#project-4.5.2-dev
#project-4.5.2-dav
#project-4.2-dav
#v0.0.4
#project-4.56.3-dev
#project-4.5..2-dav
#v0.0.3
#project-4.56.4-dev
#project-.5.2-dav
#v0.0.2
# project-0.5.2-dev
#EOF

#echo "commit 6586a29034699b520bc3722270f7fb0af9bf6965 (tag: green)" | sed -E "s/^[^:]+: ([^\),]+).*$/\1/p"

#/bin/bash bash/git/get-tags-of-current-branch.sh | /bin/bash bash/git/semver-filter-tags.sh "4"
#echo "one-two-three-two-end" | sed -E "s/-two-/-xxx-/g"

# https://stackoverflow.com/a/23241372
NOT=""

if [ "${1}" = "--not" ]; then

  NOT="!"

  shift
fi

PATTERN="$(echo "${1}" | sed -E "s/([0-9]+)\.([0-9]+)\.([0-9]+)/\[0-9\]+\\\\.\[0-9\]+\\\\.\[0-9\]+/g")"

cat - | sed -nE "/^${PATTERN}$/${NOT}p"


