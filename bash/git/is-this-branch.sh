
# Script to make sure that current branch is ${1}
# /bin/bash is-this-branch.sh master

main="${1}"

THISFILE=${BASH_SOURCE[0]}
DIR="$( cd "$( dirname "${THISFILE}" )" && pwd -P )"

source "${DIR}/../colours.sh";

set -e
set -x

if [ "${#}" -lt 1 ] ; then

    { red "\n[error] At least one argument expected, like: \n\n    /bin/bash ${0} \"branch-name\" \n"; } 2>&3

    exit 1;
fi

if [ "$(git rev-parse --abbrev-ref HEAD)" != ${main} ]; then

    { red "[error] switch first branch to '${main}'"; } 2>&3

    exit 1
fi

{ green "[ok] current branch '${main}'"; } 2>&3
