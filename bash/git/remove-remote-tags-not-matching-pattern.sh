
# /bin/bash bash/git/remove-remote-tags-not-matching-pattern.sh v0.0.0 [default origin]
# /bin/bash bash/git/remove-remote-tags-not-matching-pattern.sh v0.0.0 gca
# /bin/bash bash/git/remove-remote-tags-not-matching-pattern.sh --dontremovelocal v0.0.0 gca
# /bin/bash bash/git/remove-remote-tags-not-matching-pattern.sh --force v0.0.0 gca
# /bin/bash bash/git/remove-remote-tags-not-matching-pattern.sh --dontremovelocal --force v0.0.0 gca


_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"

_MAINLIBDIR="$(dirname "${_DIR}")"

_PROJECTMAINDIR="$(dirname "${_MAINLIBDIR}")"

A="${_DIR}/a.tmp"

B="${_DIR}/b.tmp"

/bin/bash "${_MAINLIBDIR}/fs/can-write-to-file.sh" --rm "${A}"

/bin/bash "${_MAINLIBDIR}/fs/can-write-to-file.sh" --rm "${B}"

function cleanup {

    echo "cleanup"

    /bin/bash "${_MAINLIBDIR}/fs/can-write-to-file.sh" --rm "${A}"

    /bin/bash "${_MAINLIBDIR}/fs/can-write-to-file.sh" --rm "${B}"

    if [ -e "${_PROJECTMAINDIR}/.git/_hooks" ]; then

      mv "${_PROJECTMAINDIR}/.git/_hooks" "${_PROJECTMAINDIR}/.git/hooks"
    fi
}

trap cleanup EXIT

if [ -e "${_PROJECTMAINDIR}/.git/hooks" ]; then

  mv "${_PROJECTMAINDIR}/.git/hooks" "${_PROJECTMAINDIR}/.git/_hooks"
fi

set -e

___BASENAME="$(basename "${0}")"

REMOVELOCAL="1";
if [ "${1}" = "--dontremovelocal" ]; then
  REMOVELOCAL="0";
  shift;
fi

FORCE="0";
if [ "${1}" = "--force" ]; then
  FORCE="1";
  shift;
fi

PATTERN="${1}"

if [ "${PATTERN}" = "" ]; then

  echo "${___BASENAME}: specify pattern to filter tags"

  exit 1
fi

shift;

REMOTE="${1}"

if [ "${REMOTE}" = "" ]; then

  REMOTE="origin";
fi

# remote
NOTMATCHING="$(/bin/bash "${_MAINLIBDIR}/git/get-tags-remote.sh" "${REMOTE}" | /bin/bash "${_MAINLIBDIR}/git/semver-filter-tags.sh" --not "${PATTERN}")"

if [ "${NOTMATCHING}" = "" ]; then

  echo "nothing to delete"

  exit 0;
fi

echo "${NOTMATCHING}"

CONFIRM="y"

if [ "${FORCE}" = "0" ]; then

  echo -e "\n   do you want to remove listed tags from remote:\n\n        ${REMOTE}\n    \n    y or n ?\n"

  read CONFIRM;
fi

if [ "${CONFIRM}" = "y" ]; then

#  set -x

  for tag in ${NOTMATCHING}
  do
      echo -e "\nremoving ${tag}:";

      if [ "${REMOVELOCAL}" = "1" ]; then

        git tag -d "${tag}" || true
      fi

      git push --delete "${REMOTE}" "${tag}"
  done
else

  echo "You'r anser is '${CONFIRM}' skip then..."
fi





