
#
# Library will install dependencies from package.json (both sections devDependencies and dependencies)
# one by one in order to check if each and everyone can be downloaded with no issues.
#
# Library was created in order to detect faulty libraries causing CI/CD pipeline to freeze
#
# /bin/bash yarn-install-one-by-one-separately.sh
#
# It is also possible to test this way dependencies of particular library specified in local package.json,
# simply provide library name as an argument
#
# /bin/bash yarn-install-one-by-one-separately.sh bluebird
#
# WARNING: run it from directory where package.json is located
#

_SHELL="$(ps "${$}" | grep "${$} " | grep -v grep | sed -rn "s/.*[-\/]+(bash|z?sh) .*/\1/p")"; # bash || sh || zsh
case ${_SHELL} in
  zsh)
    _DIR="$( cd "$( dirname "${(%):-%N}" )" && pwd -P )"
    _SCRIPT="${(%):-%N}"
    _BINARY="/bin/zsh"
    _PWD="$(pwd)"
    ;;
  sh)
    _DIR="$( cd "$( dirname "${0}" )" && pwd -P )"
    _SCRIPT="${0}"
    _BINARY="/bin/sh"
    _PWD="$(pwd)"
    ;;
  *)
    _DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"
    _SCRIPT="${BASH_SOURCE[0]}"
    _BINARY="/bin/bash"
    _PWD="$(pwd)"
    ;;
esac

trim() {
    local var="${*}"
    # remove leading whitespace characters
    var="${var#"${var%%[![:space:]]*}"}"
    # remove trailing whitespace characters
    var="${var%"${var##*[![:space:]]}"}"
    echo -n "${var}"
}

PB="$(basename "${_SCRIPT}")"

node -v 1> /dev/null 2> /dev/null

if [[ "${?}" != "0" ]]; then

  echo "${PB} error: node is not installed";

  exit 1
fi

MANAGER="npm install";

yarn -v 1> /dev/null 2> /dev/null

if [[ "${?}" = "0" ]]; then

  MANAGER="yarn add";
fi

JSFILE="${_DIR}/yarn-install-one-by-one-separately.js";

if [[ ! -f "${JSFILE}" ]]; then

  echo "${PB} error: ${JSFILE} doesn't exist";

  exit 1
fi

NODE_MODULES_DIRECTORY="${_PWD}/node_modules";

if [[ -d "${NODE_MODULES_DIRECTORY}" ]]; then

  echo "${PB} error: ${NODE_MODULES_DIRECTORY} exist, remove directory first before running this script";

  exit 1
fi

function remove_temporary_node_modules {

  echo "${PB} trigger remove_temporary_node_modules():";

  rm -rf "${NODE_MODULES_DIRECTORY}"
}

TRAPS=("remove_temporary_node_modules");

function trigger_traps {

  for i in "${TRAPS[@]}"
  do

      ${i} || true
  done
}

trap trigger_traps EXIT;



PACKAGEJSON="${_PWD}/package.json"

PACKAGEJSONBACKUP="${_PWD}/package.json__"

function put_back_package_json {

  echo "${PB} trigger put_back_package_json():";

  mv "${PACKAGEJSONBACKUP}" "${PACKAGEJSON}"
}

if [[ -f "${PACKAGEJSON}" ]]; then

  TRAPS+=("put_back_package_json")
fi



YARNLOCK="${_PWD}/yarn.lock"

YARNLOCKBACKUP="${_PWD}/yarn.lock__"

function put_back_yarn_lock {

  echo "${PB} trigger put_back_yarn_lock():";

  mv "${YARNLOCKBACKUP}" "${YARNLOCK}"
}

if [[ -f "${YARNLOCK}" ]]; then

  TRAPS+=("put_back_yarn_lock")
fi



LIB_SPECIFIED_IN_ARG="${1}"

if [[ "${LIB_SPECIFIED_IN_ARG}" != "" ]]; then

  mv "${PACKAGEJSON}" "${PACKAGEJSONBACKUP}" 1> /dev/null 2> /dev/null || true

  mv "${YARNLOCK}" "${YARNLOCKBACKUP}" 1> /dev/null 2> /dev/null || true

  ${MANAGER} "${LIB_SPECIFIED_IN_ARG}"

  rm -rf "${PACKAGEJSON}" 1> /dev/null 2> /dev/null || true

  rm -rf "${YARNLOCK}" 1> /dev/null 2> /dev/null || true

  LIBRARIES="$(node "${JSFILE}" "${LIB_SPECIFIED_IN_ARG}")"

  CODE="${?}"

  rm -rf "${NODE_MODULES_DIRECTORY}" 1> /dev/null 2> /dev/null || true
else

  LIBRARIES="$(node "${JSFILE}")"

  CODE="${?}"

  mv "${PACKAGEJSON}" "${PACKAGEJSONBACKUP}" 1> /dev/null 2> /dev/null || true

  mv "${YARNLOCK}" "${YARNLOCKBACKUP}" 1> /dev/null 2> /dev/null || true
fi

if [[ "${CODE}" != "0" ]]; then

  echo "${PB} error: executing command >>node "${JSFILE}"<<  failed with non zero (${CODE}) exit code, stdout: >>${LIBRARIES}<<";

  exit 1
fi

COUNT="$(echo "${LIBRARIES}" | wc -l)"

COUNT="$(trim "${COUNT}")"

I=0;
while read -r LIB
do

  I=$((${I} + 1));

  echo;

  echo "${I}/${COUNT} testing >>${LIB}<< ↓↓↓ executing: >>${MANAGER} \"${LIB}\"<<"

  echo;

  ${MANAGER} "${LIB}"

  CODE="${?}"

  if [[ "${CODE}" != "0" ]]; then

    echo "${PB} error: command >>${MANAGER} \"${LIB}\"<< failed with non zero exit code";

    exit ${CODE}
  fi

  rm -rf "${PACKAGEJSON}" 1> /dev/null 2> /dev/null || true

  rm -rf "${YARNLOCK}" 1> /dev/null 2> /dev/null || true

  rm -rf "${NODE_MODULES_DIRECTORY}" 1> /dev/null 2> /dev/null || true

done <<< "${LIBRARIES}"

echo;

echo "${PB}: all good"



