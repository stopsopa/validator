
trim() {
    local var="${*}"
    var="${var#"${var%%[![:space:]]*}"}"
    var="${var%"${var##*[![:space:]]}"}"
    echo -n "${var}"
}

TARGETBRANCH="${1}"

shift;

TARGETBRANCH="$(trim "${TARGETBRANCH}")"

if [ "${TARGETBRANCH}" = "" ]; then

  echo "${0} error: you should specify target branch"

  set -e; _exit 1> /dev/null 2> /dev/null
fi

WHATTOLIST="${1}"

shift;

WHATTOLIST="$(trim "${WHATTOLIST}")"

if [ "${WHATTOLIST}" != "merged" ] && [ "${WHATTOLIST}" != "notmerged" ]; then

  echo "${0} error: WHATTOLIST second arg should be 'merged' or 'notmerged'"

  set -e; _exit 1> /dev/null 2> /dev/null
fi

_REMOTE="origin"

if [ "${1}" != "" ]; then

  _REMOTE="${1}"

  _REMOTE="$(trim "${_REMOTE}")"

  shift;
fi



REMOTES="$(git remote)"

FILTEREDBRANCH="$(echo "${REMOTES}" | grep "^${_REMOTE}$")"

FILTEREDBRANCH="$(trim "${FILTEREDBRANCH}")"

if [ "${FILTEREDBRANCH}" = "" ]; then

  echo "${0} error: remote '${_REMOTE}' not found on the list of registered remotes '${REMOTES}'"

  set -e; _exit 1> /dev/null 2> /dev/null
fi

if [ "$(git rev-parse --abbrev-ref HEAD)" != ${TARGETBRANCH} ]; then

  echo "${0} error: you should then start from branch ${TARGETBRANCH}"

  set -e; _exit 1> /dev/null 2> /dev/null
fi

function commited {

  DIFFSTATUS="$(git status -s)"

  if [ "${DIFFSTATUS}" != "" ] ; then

      echo "${0} error: current changes not commited"

      set -e; _exit 1> /dev/null 2> /dev/null
  fi
}

function switchBack {

  git checkout ${TARGETBRANCH} 1> /dev/null 2> /dev/null;

  if [ "${?}" != "0" ] ; then

      echo "${0} error: can't switch to branch '${TARGETBRANCH}'"

      set -e; _exit 1> /dev/null 2> /dev/null
  fi
}

function reset {

  git reset -q --hard "${HSH}"

  if [ "${?}" != "0" ] ; then

      echo "${0} error: couldn't revert local branch "${TARGETBRANCH}" to commit '${HSH}'"

      set -e; _exit 1> /dev/null 2> /dev/null
  fi
}

function backtobase {

  git merge --abort 1> /dev/null 2> /dev/null

  git checkout . 1> /dev/null 2> /dev/null

  switchBack;

  reset;
}

HSH="$(git rev-parse HEAD)"

backtobase;

commited

trap backtobase EXIT;

LIST="$(
  git branch -r | \
  xargs -L1 echo | \
  grep "^${_REMOTE}" | \
  grep -v HEAD | \
  grep -v "${TARGETBRANCH}" | \
  sed -E "s/^${_REMOTE}\/(.*)/\1/"
)"

while read -r BRANCH
do

  backtobase

  git checkout -b "${BRANCH}" --track "${_REMOTE}/${BRANCH}" 1> /dev/null 2> /dev/null;

  CODE="${?}"

  if [ "${CODE}" = "128" ] || [ "${CODE}" = "0" ]; then

    switchBack
  else

    echo "${0} error: couldn't create local branch '${BRANCH}' from remote '${_REMOTE}/${BRANCH}' - exit code: ${CODE}"

    set -e; _exit 1> /dev/null 2> /dev/null
  fi

  if [ "$(git rev-parse --abbrev-ref HEAD)" != ${TARGETBRANCH} ]; then

    echo "${0} error: should be back in ${TARGETBRANCH}"

    set -e; _exit 1> /dev/null 2> /dev/null
  fi

  git merge "${BRANCH}" --no-commit --no-ff --no-edit 1> /dev/null 2> /dev/null

  DIFFSTATUS="$(git status -s)"

  if [ "${DIFFSTATUS}" = "" ] ; then

    if [ "${WHATTOLIST}" = "merged" ]; then

      echo "${BRANCH}"
    fi
  else

    if [ "${WHATTOLIST}" = "notmerged" ]; then

      echo "${BRANCH}"
    fi
  fi
done <<< "${LIST}"




