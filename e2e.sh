#
# /bin/bash e2e.sh --env .env --match tests/browser/browser.js
# /bin/bash e2e.sh --env .env --match tests/browser/browser.js --stay
# /bin/bash e2e.sh --env .env --match tests/browser/browser.js -- --target docker
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

cd "${_DIR}"

ROOT="${_DIR}"

function ec {
    echo "[${0}]: ${1}"
}

ls -la dist/validator.js 1> /dev/null 2> /dev/null

if [ "${?}" != "0" ]; then

  ec "error: dist/validator.js doesn't exist - run first /bin/bash build.sh"

  exit 1
fi

ENVFILE=""
PARAMS=""
STAY="0"
PLAYWRIGHT_TEST_MATCH=""
_EVAL=""
function collect {
  if [ "$1" = "&&" ]; then
    PARAMS="$PARAMS \&\&"
    _EVAL="$_EVAL &&"
  else
    if [ "$PARAMS" = "" ]; then
      PARAMS="\"$(quote "$1")\""
      _EVAL="\"$(quote "$1")\""
    else
      PARAMS="$PARAMS \"$(quote "$1")\""
      _EVAL="$_EVAL \"$(quote "$1")\""
    fi
  fi
}
while (( "$#" )); do
  case "$1" in
    --env)
      if [ "$2" = "" ]; then                            # PUT THIS CHECKING ALWAYS HERE IF YOU WAITING FOR VALUE
        ec "error: --env value can't be empty" >&2 # optional
        exit 1;                                          # optional
      fi
      if ! [ -f "$2" ]; then
        ec "error: --env file '$2' doesn't exist" >&2 # optional
        exit 1;                                          # optional
      fi                                           # optional
      ENVFILE="$2";
      shift 2;
      ;;
    --match)
      if [ "$2" = "" ]; then                            # PUT THIS CHECKING ALWAYS HERE IF YOU WAITING FOR VALUE
        ec "error: --match value can't be empty" >&2 # optional
        exit 1;                                          # optional
      fi                                       # optional
      PLAYWRIGHT_TEST_MATCH="$2";
      shift 2;
      ;;
    -s|--stay)                                      # optional
      STAY="1";
      shift;
      ;;
    --) # end argument parsing
      shift;
      while (( "$#" )); do          # optional
        collect "${1}" "${2}";
        shift;                      # optional
      done                          # optional if you need to pass: /bin/bash $0 -f -c -- -f "multi string arg"
      break;
      ;;
    -*|--*=) # unsupported flags
      ec "error: Unsupported flag $1" >&2
      exit 1;
      ;;
    *) # preserve positional arguments
      collect "${1}" "${2}";
      shift;
      ;;
  esac
done

trim() {
    local var="$*"
    # remove leading whitespace characters
    var="${var#"${var%%[![:space:]]*}"}"
    # remove trailing whitespace characters
    var="${var%"${var##*[![:space:]]}"}"
    echo -n "$var"
}

PARAMS="$(trim "$PARAMS")"
_EVAL="$(trim "$_EVAL")"

if [ "${PLAYWRIGHT_TEST_MATCH}" != "" ]; then
    export PLAYWRIGHT_TEST_MATCH;
fi

if [ "${ENVFILE}" = "" ]; then

  ec "error: first argument ENVFILE is not defined"

  exit 1;
fi

if [ ! -f "${ENVFILE}" ]; then
    ec "first argument ${ENVFILE} doesn't exist"

    exit 1
fi

set -e

# source "${ENVFILE}";
eval "$(/bin/bash "${_DIR}/jasmine/lib/exportsource.sh" "${ENVFILE}")"

set +e

if [ "${NODE_API_HOST}" = "" ]; then

  ec "error: NODE_API_PORT is not defined"

  exit 1;
fi

if [ "${NODE_API_HOST}" = "" ]; then

  ec "error: NODE_API_HOST is not defined"

  exit 1;
fi

SERVER="http://${NODE_API_HOST}:${NODE_API_PORT}";

echo "SERVER: ${SERVER}"

function cleanup {

    echo 'clean...'

    set +e

    curl  -sS "${SERVER}/exit" 2>/dev/null

    unlink "${ASSETLIST}" 2>/dev/null || true
}

cleanup

trap cleanup EXIT;

sleep 0.2

set -e
set -x

node "${_DIR}/jasmine/server_koa.js" --web "${ROOT}" --env "${ENVFILE}" &

set +e
set +x

ec "Waiting for server healthcheck - ${SERVER}/healthcheck:";
# https://stackoverflow.com/a/33520390/5560682
until [ "$(curl -sS "${SERVER}/healthcheck" 2>/dev/null)" = "jasmine healthy" ]; do
    printf "."
    sleep 0.5;
done;
echo ""
ec "...server is working"

/bin/bash playwright.sh --env "${ENVFILE}" "$@"

STATUS=${?}

if [ "${STAY}" = "1" ]; then

    cat <<EEE

    Open:

      ${SERVER}

    Press Ctrl+C to exit

EEE

    tail -f /dev/null
fi

exit ${STATUS}
