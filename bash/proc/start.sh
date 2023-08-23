#!/bin/bash

set -e
set -x


_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"

source "${_DIR}/../colours.sh";

source "${_DIR}/../trim.sh"

if [ "${#}" -lt "3" ]; then

    { red "${0} error: run like /bin/bash ${0} pathto/.env ENV_NAME_WITH_FLAG /bin/bash something_to_run.sh param1 param2 ..."; } 2>&3

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

LOGDIR="${_DIR}/../../var/logs"

mkdir -p "${LOGDIR}"

LOGFILE="${LOGDIR}/000-forever.log"

#rm -rf ${LOGFILE}

{ yellow "PWD           : $(pwd)"; } 2>&3
{ yellow "FLAG_VARIABLE : ${FLAG_VARIABLE}"; } 2>&3
{ yellow "ENVFILE       : ${ENVFILE}"; } 2>&3
{ yellow "FLAG          : ${FLAG}"; } 2>&3
{ echo   "REST ARGS     : ${@}"; } 2>&3
{ yellow "LOGDIR        : ${LOGDIR}"; } 2>&3
{ yellow "LOGFILE       : ${LOGFILE}"; } 2>&3

# node node_modules/.bin/forever --no-colors -d -t --minUptime 5000 --spinSleepTime 10000 -v -a -c /bin/bash run.sh ${FLAG} 1>> ${LOGFILE} 2>> ${LOGFILE} & disown

# I've removed forever from dependencies because of security alert from github
# https://i.imgur.com/jIGv0m5.png
# 'timespan' lib is dependency of forever
# It looks like forever team did removed timespan dependency but at the moment it's not released:
# https://github.com/foreverjs/forever/commit/6ff93441c8dda9a90ece69e910c729788bc130ae
if [ ! -f node_modules/.bin/forever ]; then yarn add forever; fi

node node_modules/.bin/forever --no-colors -d -t --minUptime 2000 -v -a -c ${@} ${FLAG} 1>> ${LOGFILE} 2>> ${LOGFILE} & disown