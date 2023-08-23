
function help {

cat << EOF

  /bin/bash ${0} path/to/mysq.sql       - specify file
  /bin/bash ${0} path/to                - or directory
  /bin/bash ${0} path/to .env.kub.stage - \${2} argument to specify from which .env file

  /bin/bash bash/mysql/export.sh ../all_#.tar.gz
    where # will be replaced with "databasename_2019_12_04_14_15_42" - current time

  # /bin/bash ${0} path/to/mysq.sql.tar.gz - not implemented yet

  Might be necessary running:
      (cd bash && echo "{}" > package.json && yarn add dotenv-up)

EOF
}

if [ "${1}" = "--help" ]; then

    help

    exit 0
fi


_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"

source "${_DIR}/../colours.sh";

source "${_DIR}/../time-format.sh"

if [ ${#} -lt 1 ]; then

    { red "specify target directory or file as a first argument"; } 2>&3

    help

    exit 1;
fi

realpath . 1> /dev/null 2> /dev/null

if [ "${?}" != "0" ]; then

    { red "realpath is not installed run: brew install coreutils"; } 2>&3

    exit 1;
fi

FILE=".env"

if [ "${2}" != "" ]; then

    if [ ! -f "${2}" ]; then

        { red "FILE \${2}: '${2}' doesn't exist"; } 2>&3

        help

        exit 1;
    fi

    FILE="$(basename "${2}")"
fi

set -e
set -x

HOST="$(node "${_DIR}/../node/env/getter.js" PROTECTED_MYSQL_HOST --env-file "${FILE}")"
USER="$(node "${_DIR}/../node/env/getter.js" PROTECTED_MYSQL_USER --env-file "${FILE}")"
PORT="$(node "${_DIR}/../node/env/getter.js" PROTECTED_MYSQL_PORT --env-file "${FILE}")"
PASS="$(node "${_DIR}/../node/env/getter.js" PROTECTED_MYSQL_PASS --env-file "${FILE}")"
DB="$(node "${_DIR}/../node/env/getter.js" PROTECTED_MYSQL_DB --env-file "${FILE}")"

PASS="$(echo "${PASS}" | sed -E 's# #\\ #g')"

cat << EOF

  HOST  "${HOST}"
  USER  "${USER}"
  PORT  "${PORT}"
  PASS  "${PASS}"
  DB    "${DB}"

EOF

P="$(realpath -m "${1}")"

TMP="${DB}_$(_datetime _)"

if [[ ${P} = *"#"* ]]; then

  P="$(echo "${P}" | sed -E "s#\##${TMP}#g")"
fi

#mysql -h "${HOST}" -u "${USER}" -P${PORT} -p${PASS} "${DB}" < "${1}"

COLUMNSTATISTICSEXIST="$(mysqldump --help | grep column-statistics || true)"

if [ "${COLUMNSTATISTICSEXIST}" = "" ]; then

    COLUMNSTATISTICSEXIST=""
else

    COLUMNSTATISTICSEXIST=" --column-statistics=0"
fi

FILE="${P}/${TMP}.sql"

if [ ! -d "${P}" ]; then

    DI="$(dirname "${P}")"

    if [ ! -d "${DI}" ]; then

        { red "'${DI}' is not a directory"; } 2>&3

        help

        exit 1
    fi

    FILE="${P}"
fi

set +x
set +e

CMD="mysqldump${COLUMNSTATISTICSEXIST} -C -h \"${HOST}\" -u \"${USER}\" \"-P${PORT}\" \"-p${PASS}\" \"${DB}\""

printf "\nexecuting command:\n\n${CMD} > \"${FILE}\"\n\n";

RESULT="$(eval "${CMD} > \"${FILE}\"")"

CODE="${?}"

if [ "${CODE}" = "0" ]; then

  { green "\n    file ${FILE} created\n    All good, exit code: 0\n"; } 2>&3

else

  { red "\n    general error\n"; } 2>&3

fi

exit ${CODE};




