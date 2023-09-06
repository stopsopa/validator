# remove all from coverage/* directory, except to file coverage/coverage-badge.svg

cat <<EEE

No need for this one really, I will not remove content of directory coverage before publishing to github actions
but it's still interesting script to remove everything from directory except SOMETHING
EEE

exit 1

_SHELL="$(ps "${$}" | grep "${$} " | grep -v grep | sed -rn "s/.*[-\/]+(bash|z?sh) .*/\1/p")"; # bash || sh || zsh
case ${_SHELL} in
  zsh)
    _DIR="$( cd "$( dirname "${(%):-%N}" )" && pwd -P )"
    _0="$( basename "${(%):-%N}" )"
    _SCRIPT="${(%):-%N}"
    _BINARY="/bin/zsh"
    _PWD="$(pwd)"
    ;;
  sh)
    _DIR="$( cd "$( dirname "${0}" )" && pwd -P )"
    _0="$( basename "${0}" )"
    _SCRIPT="${0}"
    _BINARY="/bin/sh"
    _PWD="$(pwd)"
    ;;
  *)
    _DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"
    _0="$( basename "${BASH_SOURCE[0]}" )"
    _SCRIPT="${BASH_SOURCE[0]}"
    _BINARY="/bin/bash"
    _PWD="$(pwd)"
    ;;
esac

set -e
set -x

cd "${_DIR}/../../coverage"

set +x

LIST="$(find . -mindepth 1 -maxdepth 1 | grep -v -i -E '^\./coverage-badge\.svg$' || true)"

if [ "${LIST}" = "" ]; then
    echo nothing found to remove
else
cat <<EEE
deleting:
${LIST}
EEE
fi

cat <<EEE | xargs -I % rm -rf "%"
${LIST}
EEE