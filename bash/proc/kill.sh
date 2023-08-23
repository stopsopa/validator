#!/bin/bash

# use:
# /bin/bash kill.sh flag-name
# to ignore this script
# /bin/bash kill.sh flag-name ${$}
# /bin/bash kill.sh flag-name ${$} something-else-to-ignore "and something else to ignore"

# alternatively as a oneliner
# ps aux | grep "jfkdsjlkfjdskljfkdsjf" | grep -v grep | awk '{print $2}' | xargs kill
# or more aggressively
# ps aux | grep "jfkdsjlkfjdskljfkdsjf" | grep -v grep | awk '{print $2}' | xargs kill -9


set -e
set -x


_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"

source "${_DIR}/../colours.sh";

source "${_DIR}/../trim.sh"

if [ "${#}" -lt "2" ]; then

    { red "${0} error: run like /bin/bash ${0} pathto/.env ENV_NAME_WITH_FLAG"; } 2>&3

    exit 1
fi

ENVFILE="${1}";

if [ ! -f "${ENVFILE}" ]; then

    ENVFILE="${_DIR}/${1}";

    if [ ! -f "${ENVFILE}" ]; then

        { red "${0} error: file: '${ENVFILE}' nor '${1}' doesn't exist"; } 2>&3

        exit 1;
    fi
fi

{ yellow "importing ${ENVFILE} vvv"; } 2>&3

source ${ENVFILE};

{ yellow "importing ${ENVFILE} ^^^"; } 2>&3

shift;

FLAG_VARIABLE=${1}

FLAG="$(eval echo "\$${FLAG_VARIABLE}")"

FLAG="$(trim "${FLAG}")"

if [ "${FLAG}" = "" ]; then

    { red "${0} error: There is no value under global variable '\$${FLAG_VARIABLE}'"; } 2>&3

    exit 1
fi

shift;

THISFILE="$(basename ${0})" || true

LIST=$(ps aux | grep "${FLAG}" | grep -v grep | grep -v " ${THISFILE}") || true

if [ "${#}" -gt 1 ]; then

    # https://stackoverflow.com/a/1336245
    # https://stackoverflow.com/a/2390870
    IGNORE=("${@:2}") || true

    # to see what's inside array:
    # declare -p IGNORE

    # echo -e ">>[${C}]<<"

    # echo -e "pure: >>${LIST}<<";

    for i in "${IGNORE[@]}"
    do
        LIST=$(echo -e "${LIST}"  | grep -v "${i}") || true;
        # echo -e "after '${i}': >>${LIST}<<";
    done
fi

PIDS=$(echo -e "${LIST}" | awk '{print $2}') || true;

{ yellow "\nlisting processes to kill:\n"; } 2>&3
{ yellow $"${LIST}\n"; } 2>&3

{ yellow "\nlisting pids to kill:\n"; } 2>&3
{ yellow $"${PIDS}\n"; } 2>&3

for pid in ${PIDS}
do
    { yellow "attempt to kill ${pid}"; } 2>&3
    kill -s 9 ${pid} && echo 'success' || echo 'failure'
done

{ echo -e "\n"; } 2>&3


