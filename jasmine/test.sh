

# Usually you should call this script from main directory of the project which is one dir up from where this bash script is
# this will make sure all relative paths passed from cli as arguments to this script to work nice 
# 
# Lifecycle phases of this script:
#     Generally what this script is doing is perparing (bundling) all desired test files to be delivered to the browser context.
#     Then it launches temporary http server for playwright testing.
#     All tests are executed (using jasmine-core lib) in the browser after load and result of all tests are fetched.
#     Testing in playwright is done with just one test with one expect().toEqual() 
#     comparing desired state of fetched states with desired state.
#
#     All above is done in following phases:
#     - looks for all test files by globs "*.jasmine.js" or "*.jasmine.unit.js" (patterns might be changed with --find argument)
#       - optionally you can also filter list of found files with --filter argument (grep example provided below)
#       - you might also specify your own single file using --test argument
#     - then it process each of found test files via esbuild to *.jasmine-esbuild.js
#     - then it launches simple koa server in the background serving all files from 
#       the root directory of the project (using NODE_API_PORT env var). Making them available in the browser.
#     - then it launches playwright.sh script passing all arguments given to this script after first -- (double dash)
#     - then as a last step it stopps background koa server (look for server logs in jasmine/var directory)
#       (this might be delayed with --stay argument)
#     - forward exit code from playwright.sh making it exit code for this script
#
# Usage:
#     the only required argument is --env - to point to the file with .env
#
# to launch playwright locally
#     /bin/bash jasmine/test.sh --env .env

# pay attention to argument -- (double dash)
#                        right here ----vv
# /bin/bash jasmine/test.sh --env .env -- --target docker
#
#     double dash argument above separates arguments consumed by this script 
#     from arguments passed down the line to playwright.sh
#        
#        
# you can change default pattern to 'find' program, the default is :
#                   -name "*.jasmine.js" -o -name "*.jasmine.unit.js"
# for example to skip looking for '*.jasmine.js' files run:
#     /bin/bash jasmine/test.sh --env .env --find '-name "*.jasmine.unit.js"' -- --target docker
#     
# you can filter your list of found tests files with --filter argument
#     /bin/bash jasmine/test.sh --env .env --filter "grep -i -E 'abc'" -- --target docker
#    
# you might also provide path to particular test file 
#     /bin/bash jasmine/test.sh --env .env --test app/api/admin/test.abc.jasmine.js -- --target docker
#     (--test argument takes precedence over --find and --filter, those two are simply not used when --test is used)
#    
# using --stay prevent script from finishing its job until you press cmd+C
# this is here to provide opportunity to open server_koa.js link in browser for manual inspection
# (read more in "Lifecycle phases" section above why it is needed)
#     /bin/bash jasmine/test.sh --env .env --stay

# when your main project server is already working (when NODE_API_PORT from provided .env is taken) 
# then it is good idea to override it
#     NODE_API_PORT=4273 /bin/bash jasmine/test.sh --env .env --stay -- --target docker
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

_PWD="$(pwd)"

ROOT="${_DIR}/.."

function ec {
    echo "[${0}]: ${1}"
}

STAY="0"

ENVFILE=""
PARAMS=""
FILTER=""
FIND='-name "*.jasmine.js" -o -name "*.jasmine.unit.js"'
TEST=""
_EVAL=""
function quote {
  echo "$1" | sed -E 's/\"/\\"/g'
}
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
      #          PARAMS="$(cat <<EOF
      #$PARAMS
      #- "$1"
      #EOF
      #)"
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
    --find)
      if [ "$2" = "" ]; then                            # PUT THIS CHECKING ALWAYS HERE IF YOU WAITING FOR VALUE
        ec "error: --find value can't be empty" >&2 # optional
        exit 1;                                          # optional
      fi                                       # optional
      FIND="$2";
      shift 2;
      ;;
    --filter)
      if [ "$2" = "" ]; then                            # PUT THIS CHECKING ALWAYS HERE IF YOU WAITING FOR VALUE
        ec "error: --filter value can't be empty" >&2 # optional
        exit 1;                                          # optional
      fi                                       # optional
      FILTER="$2";
      shift 2;
      ;;
    --test)
      if [ "$2" = "" ]; then                            # PUT THIS CHECKING ALWAYS HERE IF YOU WAITING FOR VALUE
        ec "error: --test value can't be empty" >&2 # optional
        exit 1;                                          # optional
      fi                                       # optional
      TEST="$2";
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

if [ "${ENVFILE}" = "" ]; then

  ec "error: --env ENVFILE is not defined"

  exit 1;
fi

if [ ! -f "${ENVFILE}" ]; then
    ec "--env ${ENVFILE} doesn't exist"

    exit 1
fi

# source "${ENVFILE}";
eval "$(/bin/bash "${_DIR}/lib/exportsource.sh" "${ENVFILE}")"

if [ "${NODE_API_HOST}" = "" ]; then

  ec "error: NODE_API_PORT is not defined"

  exit 1;
fi

if [ "${NODE_API_HOST}" = "" ]; then

  ec "error: NODE_API_HOST is not defined"

  exit 1;
fi

SERVER="http://${NODE_API_HOST}:${NODE_API_PORT}";

# set positional arguments in their proper place
eval set -- "$PARAMS"

openssl help 1> /dev/null 2> /dev/null

if [ "${?}" != "0" ]; then

  ec "error: openssl is not installed"

  exit 1
fi

node node_modules/.bin/esbuild --help 1> /dev/null 2> /dev/null

if [ "${?}" != "0" ]; then

  ec "error: node_modules/.bin/esbuild not present"

  exit 1
fi

if [ ! -d "${_DIR}/var" ]; then

  mkdir "${_DIR}/var"
fi

if [ ! -d "${_DIR}/var" ]; then

  ec "error: can't create ${_DIR}/var"

  exit 1
fi

while true
do
  DATE="$(date '+%Y-%m-%d_%H-%M-%S')"
  PART="$(openssl rand -hex 2)"
  LOGFILE="${_DIR}/var/${DATE}_${PART}.log"
  ASSETLIST="${_DIR}/var/${DATE}_${PART}.txt"

  if [ ! -e "${LOGFILE}" ]; then  # not exist (fnode, directory, socket, etc.)

      break
  fi
done

printf "" > "${ASSETLIST}"

function cleanup {

    set +e

    curl  -sS "${SERVER}/exit" 2>/dev/null

    unlink "${ASSETLIST}" 2>/dev/null || true
}

cleanup

trap cleanup EXIT;

sleep 0.2

# set -x
set -e

# (
#     cd "${_DIR}" 
#     unlink bundles/node_modules 2>/dev/null || true
#     mkdir -p bundles
#     ln -s ../../node_modules/ bundles/node_modules
# )

function es {
  # "${_DIR}/../node_modules/.bin/esbuild" "${1}" --allow-overwrite --bundle --sourcemap --target=chrome80 --outfile="${2}"
  node "${_DIR}/../node_modules/.bin/esbuild" "${1}" --allow-overwrite --bundle --target=chrome80 --outfile="${2}"
}

# https://esbuild.github.io/getting-started/#install-esbuild
# es "${_DIR}/jasmine.js" "${_DIR}/bundles/jasmine.js"
# no need for above now, since we are not importing anything then we can use raw file - no need to bundle

function build {

  OUTPUT="$(node "${_DIR}/filename_transformer.js" "${1}")"  

  ROOT_RELATIVE="$(node "${_DIR}/filename_transformer.js" "${1}" "${ROOT}")"

  es "${1}" "${OUTPUT}" 

  echo "${ROOT_RELATIVE}" >> "${ASSETLIST}"
}

if [ "${TEST}" = "" ]; then
  EXEFIND="find . \( \
        -type d -name node_modules -prune -o \
        -type d -name .git -prune -o \
        -type d -name coverage -prune \
    \) \
    -o \
    \( -type f \( ${FIND} \) -print \)"

  LIST="$(eval "${EXEFIND}")"

  if [ "${FILTER}" != "" ]; then
    LIST="$(echo "${LIST}" | eval "${FILTER}")" 
  fi
else
  LIST="${TEST}"
fi

# echo ">${LIST}<"

# exit 0

if [ "${LIST}" = "" ]; then

  cat <<EEE

  [${0}] no "*.jasmine.js" or "*.jasmine.unit.js" test files found

EEE

  exit 1

else
  COUNT="$(echo "${LIST}" | wc -l)"
  COUNT="$(trim "${COUNT}")"
  I="1"
  while read -r TESTFILE
  do

    ec "esbuild ${I}/${COUNT} test '${TESTFILE}'"

    build "${TESTFILE}"

    I="$(($I + 1))"

  done <<< "${LIST}"
fi

node "${_DIR}/server_koa.js" --web "${ROOT}" --asset_list "${ASSETLIST}" --env "${ENVFILE}" 1>> "${LOGFILE}" 2>> "${LOGFILE}" & disown

set +x

ec "Waiting for server healthcheck - ${SERVER}/healthcheck:";
# https://stackoverflow.com/a/33520390/5560682
until [ "$(curl -sS "${SERVER}/healthcheck" 2>/dev/null)" = "jasmine healthy" ]; do
    printf "."
    sleep 0.5;
done;
echo ""
ec "...server is working"
# set -x

# ----------- do my stuff -------------- vvv

export PLAYWRIGHT_TEST_MATCH="jasmine/jasmine.playwright.js"

cat <<EEE

  running playwright.sh script:

    /bin/bash playwright.sh --env "${ENVFILE}" $@

EEE

set +e
set +x

# /bin/bash playwright.sh --env "${ENVFILE}" "$@"
/bin/bash bash/swap-files-v2.sh package.json package.dev.json -- /bin/bash playwright.sh --env "${ENVFILE}" "$@"

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





