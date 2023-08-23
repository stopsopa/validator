#
# kill version 2 - upgraded
# this script is just designed to kill particular processes found in ps aux filtered with grep
# look at the very bottom of this script where exact grep sequences are specified with explanation what is supposed to be killed
#

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

source "${_DIR}/trim.sh"

set +e

function findDevFrontServerPid {
    CMD="${1}"

    ROW="$(eval "${CMD}")"

    echo -e "  executing: >${CMD}< found rows:\n  ${ROW:->not found<}"

    PID_CMD="echo '${ROW}' | awk '{ print \$2 }'"

    PIDS="$(eval "${PID_CMD}")"

    PIDS="$(trim "${PIDS}")"

    if [ "${PIDS}" != "" ]; then
        echo "  executing: >${CMD}< pids: >$(echo -n "${PIDS}" | tr '\n' ',')<"
    fi
}

function tryToKill {
    findDevFrontServerPid "${1}"

    while read -r PID
    do

        if [ "${PID}" != "" ]; then
            if [[ ${PID} =~ ^[0-9]+$ ]]; then

                echo "  executing: >${CMD}< attempt to kill >${PID}<"

                kill "${PID}"

                sleep 1
            else
                echo "  executing: >${CMD}< error: if it's not empty then it should be integer"
            fi
        else

            echo "  executing: >${CMD}< status: not found in the first place"
        fi

    done <<< "${PIDS}"

    echo "  executing: >${CMD}< find again after..."

    findDevFrontServerPid "${1}"
    if [ "${PIDS}" = "" ]; then

        echo "  executing: >${CMD}< status: successfully killed"
    else

        echo "  executing: >${CMD}< status: couldn't kill, pids >${PIDS}<"

        exit 1
    fi
}

#
#set -e
#
#source "${_DIR}/../env.sh" # to have PROJECT_NAME from .env available
#
#set +e

echo "attempt to kill DynamoDBLocal.jar:"
tryToKill "ps aux | grep DynamoDBLocal.jar | grep -v grep"


