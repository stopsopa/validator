
# Script to safely checkout to different branch
# /bin/bash change-branch.sh master

target="${1}"

THISFILE=${BASH_SOURCE[0]}
DIR="$( cd "$( dirname "${THISFILE}" )" && pwd -P )"

function _datetime {
    date "+%Y-%m-%d %H:%M:%S"
}

MODE="merge-with-diff"

if [ "${2}" != "" ]; then

  TEST="^(merge-with-diff|merge-no-diff)$"

  if ! [[ "${2}" =~ ${TEST} ]]; then

    echo "should be: /bin/bash ${0} ${1} merge-with-diff|merge-no-diff"

    exit 1;
  fi

  MODE="${2}"
fi

source "${DIR}/../colours.sh";

THISBRANCH="$(git rev-parse --abbrev-ref HEAD)";

if [ "${#}" -lt 1 ] ; then

    { red "\n[error] At least one argument expected, like: \n\n    /bin/bash ${0} \"branch-to-merge\" \n"; } 2>&3

    exit 1;
fi

while true
do

  { green "    attempt to merge branch '${target}' to (current branch) '${THISBRANCH}', MODE: ${MODE}\n"; } 2>&3

  if [ "${MODE}" = "merge-with-diff" ]; then
    git merge ${target} --no-edit
  else
    git merge ${target} --no-commit --no-ff --no-edit
    git reset HEAD .
    git checkout .
    git clean -df
    git commit --no-edit
  fi

  echo "code: ${?}"

  if [ ${?} = 0 ]; then

      { green "[ok] merging branch '${target}' - success"; } 2>&3

      break;
  fi

  { yellow "\n    $(_datetime): merge conflict, please resolve conflict manually and press ENTER, or just stop entire script by Ctrl+C\n        optionally you can also execute git merge --abort"; } 2>&3

  read trash
done

