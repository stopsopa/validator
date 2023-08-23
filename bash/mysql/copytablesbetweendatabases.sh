
function help {

cat << EOF

  /bin/bash ${0} .env.kub.prod .env.kub.stage
  /bin/bash ${0} [source env] [target env]
  /bin/bash ${0} [source env] [target env] [optional segment to search = default 'test']
  /bin/bash ${0} [source env] [target env] --force

  --force         - flag will copy even despite target database doesn't contain 'test' string in it's name

  Might be necessary running:
      (cd bash && echo "{}" > package.json && yarn add dotenv-up)

EOF
}

set -o pipefail

_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"

source "${_DIR}/../colours.sh";

if [ ! -f "${1}" ]; then

    { red "FILE \${1}: '${1}' doesn't exist"; } 2>&3

    help

    exit 1;
fi

if [ ! -f "${2}" ]; then

    { red "FILE \${2}: '${2}' doesn't exist"; } 2>&3

    help

    exit 1;
fi

FORCE="0"

STOP_IF_NOT_MATCH="test"

if [ "${3}" != "" ]; then

    if [ "${3}" = "--force" ]; then

        FORCE="1"
    else

        STOP_IF_NOT_MATCH="$(/bin/bash "${_DIR}/../preg_quote.sh" "${3}")"
    fi
fi

if [ "$(basename "${1}")" = "$(basename "${2}")" ]; then

    { red "${0} error: source and target env files is the same file"; } 2>&3

    help

    exit 1;
fi

PB="$(basename "${1}")"

set -e
set -x

SHOST="$(node "${_DIR}/../node/env/getter.js" PROTECTED_MYSQL_HOST --env-file "${PB}")"
SUSER="$(node "${_DIR}/../node/env/getter.js" PROTECTED_MYSQL_USER --env-file "${PB}")"
SPORT="$(node "${_DIR}/../node/env/getter.js" PROTECTED_MYSQL_PORT --env-file "${PB}")"
SPASS="$(node "${_DIR}/../node/env/getter.js" PROTECTED_MYSQL_PASS --env-file "${PB}")"
SDB="$(node "${_DIR}/../node/env/getter.js" PROTECTED_MYSQL_DB --env-file "${PB}")"

set +e
set +x

{ yellow "

  source:

    SHOST:  "${SHOST}"
    SUSER:  "${SUSER}"
    SPORT:  "${SPORT}"
    SPASS:  "${SPASS}"
    SDB:    "${SDB}"

"; } 2>&3

if [ "${SDB}" = "" ]; then

    { red "${0} error: Environment variable PROTECTED_MYSQL_DB is empty or not defined in ${1}"; } 2>&3

    help

    exit 1;
fi

PB="$(basename "${2}")"

set -e
set -x

THOST="$(node "${_DIR}/../node/env/getter.js" PROTECTED_MYSQL_HOST --env-file "${PB}")"
TUSER="$(node "${_DIR}/../node/env/getter.js" PROTECTED_MYSQL_USER --env-file "${PB}")"
TPORT="$(node "${_DIR}/../node/env/getter.js" PROTECTED_MYSQL_PORT --env-file "${PB}")"
TPASS="$(node "${_DIR}/../node/env/getter.js" PROTECTED_MYSQL_PASS --env-file "${PB}")"
TDB="$(node "${_DIR}/../node/env/getter.js" PROTECTED_MYSQL_DB --env-file "${PB}")"

set +e
set +x

{ yellow "

  target:

    THOST:  "${THOST}"
    TUSER:  "${TUSER}"
    TPORT:  "${TPORT}"
    TPASS:  "${TPASS}"
    TDB:    "${TDB}"

"; } 2>&3

if [ "${TDB}" = "" ]; then

    { red "${0} error: Environment variable PROTECTED_MYSQL_DB is empty or not defined in ${2}"; } 2>&3

    help

    exit 1;
fi

if [ "${FORCE}" = "0" ] && ! [[ ${TDB} =~ ${STOP_IF_NOT_MATCH} ]]; then

    { red "${0} error: Target database name '${TDB}' dont match to fuse "${STOP_IF_NOT_MATCH}", add --force to proceed"; } 2>&3

    help

    exit 1;
fi

SOURCE="mysqldump";

COLUMNSTATISTICSEXIST="$(mysqldump --help | grep column-statistics || true)"

if [ "${COLUMNSTATISTICSEXIST}" != "" ]; then

    SOURCE="${SOURCE} --column-statistics=0"
fi

if [ "${SHOST}" != "" ]; then SOURCE="${SOURCE} -h ${SHOST}"; fi
if [ "${SUSER}" != "" ]; then SOURCE="${SOURCE} -u ${SUSER}"; fi
if [ "${SPASS}" != "" ]; then SOURCE="${SOURCE} -p${SPASS}"; fi
if [ "${SPORT}" != "" ] && [ "${SPORT}" != "3306" ]; then SOURCE="${SOURCE} -P${SPORT}"; fi
if [ "${SDB}"   != "" ]; then SOURCE="${SOURCE} ${SDB}"; fi

TARGET="mysql";

if [ "${THOST}" != "" ]; then TARGET="${TARGET} -h ${THOST}"; fi
if [ "${TUSER}" != "" ]; then TARGET="${TARGET} -u ${TUSER}"; fi
if [ "${TPASS}" != "" ]; then TARGET="${TARGET} -p${TPASS}"; fi
if [ "${TPORT}" != "" ] && [ "${TPORT}" != "3306" ]; then TARGET="${TARGET} -P${TPORT}"; fi
if [ "${TDB}"   != "" ]; then TARGET="${TARGET} ${TDB}"; fi

/bin/bash "${_DIR}/cleardb.sh" "${PB}" --force

{ yellow "

  Command to execute:

  ${SOURCE} | ${TARGET}

"; } 2>&3

${SOURCE} | ${TARGET}

CODE="${?}"

printf "\nRESULT: ${RESULT}\n";

if [ "${CODE}" = "0" ]; then

  { green "\n    database copied \n"; } 2>&3
else

  { red "\n    general error \n"; } 2>&3
fi

exit ${CODE};


