
# Script to safely checkout to different branch
# /bin/bash change-branch.sh master

target="${1}"


_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"

source "${_DIR}/../colours.sh";

if [ "${#}" -lt 1 ] ; then

    { red "\n[error] At least one argument expected, like: \n\n    /bin/bash ${0} \"branch-name\" \n"; } 2>&3

    exit 1;
fi

/bin/bash ${_DIR}/is-commited.sh

git checkout ${target};

if [ "$(git rev-parse --abbrev-ref HEAD)" != ${target} ]; then

    { red "[error] checkout to '${target}' - failed"; } 2>&3

    exit 1
fi

{ green "[ok] checkout to '${target}' - success"; } 2>&3
