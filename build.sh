

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

function ec {
    echo "[${0}]: ${1}"
}

node node_modules/.bin/esbuild --help 1> /dev/null 2> /dev/null

if [ "${?}" != "0" ]; then

  ec "error: node_modules/.bin/esbuild not present"

  exit 1
fi

set -e
set -x

function es {

    INPUT="${1}"
    
    OUTPUT="${2}"

    shift 2;

    if [ "${@}" = "" ]; then

        node node_modules/.bin/esbuild "${INPUT}" --allow-overwrite --bundle --target=chrome80 --outfile="${OUTPUT}" 
    else

        node node_modules/.bin/esbuild "${INPUT}" --allow-overwrite --bundle --target=chrome80 --outfile="${OUTPUT}" "$@"
    fi
}

es "validator/index.js" "dist/validator.js" 

es "validator/index.js" "dist/validator.min.js" --minify

es "validator/index.js" "dist/validator.es2017.js" --target=es2017

es "validator/index.js" "dist/validator.es2017.min.js" --minify --target=es2017

es "validator/index.js" "dist/validator.iife.js" --target=es2017 --format=iife --global-name=validator

es "validator/index.js" "dist/validator.iife.min.js" --minify --target=es2017 --format=iife --global-name=validator
