
function help {

cat << EOF

  /bin/bash ${0} --force
  # executing this script without --force parameter will only print credentials to connect to database
  # to ensure that you will execute it no right database

  /bin/bash ${0} --force .env.kub.prod
  /bin/bash ${0} .env.kub.prod --force

  Might be necessary running:
      (cd bash && echo "{}" > package.json && yarn add dotenv-up)

EOF
}

if [ "${1}" = "--help" ]; then

    help

    exit 0
fi

FILE=".env"

FORCE="0"
while (( "${#}" )); do
  case "${1}" in
    --force)
      FORCE="1";
      shift;
      ;;
    -*|--*=) # unsupported flags
      echo "${0} error: Unsupported flag ${1}" >&2
      exit 1;
      ;;
    *) # preserve positional arguments
      FILE="${1}"
      shift;
      ;;
  esac
done

if [ "${FILE}" = "" ]; then

    FILE=".env"
fi

_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"

source "${_DIR}/../colours.sh";

if [ "${FILE}" != "" ]; then

    if [ ! -f "${FILE}" ]; then

        { red "FILE \${1}: '${FILE}' doesn't exist"; } 2>&3

        help

        exit 1;
    fi

    FILE="$(basename "${FILE}")"
fi

set -x

HOST="$(node "${_DIR}/../node/env/getter.js" PROTECTED_MYSQL_HOST --env-file "${FILE}")"
USER="$(node "${_DIR}/../node/env/getter.js" PROTECTED_MYSQL_USER --env-file "${FILE}")"
PORT="$(node "${_DIR}/../node/env/getter.js" PROTECTED_MYSQL_PORT --env-file "${FILE}")"
PASS="$(node "${_DIR}/../node/env/getter.js" PROTECTED_MYSQL_PASS --env-file "${FILE}")"
DB="$(node "${_DIR}/../node/env/getter.js" PROTECTED_MYSQL_DB --env-file "${FILE}")"

PASS="$(echo "${PASS}" | sed -E 's# #\\ #g')"

set +x

{ yellow "

TARGET:

  HOST  "${HOST}"
  USER  "${USER}"
  PORT  "${PORT}"
  PASS  "${PASS}"
  DB    "${DB}"

"; } 2>&3

if [ "${DB}" = "" ]; then

    { red "${0} error: Environment variable PROTECTED_MYSQL_DB is empty or not defined in ${FILE}"; } 2>&3

    help

    exit 1;
fi

if [ "${FORCE}" = "0" ]; then

    { red "\n${0} error: add --force parameter to execute it for real\n"; } 2>&3

    help

    exit 1;
fi

CHECK="mysql -h ${HOST} -u ${USER} -P${PORT} -p${PASS} \"${DB}\" -e \"show tables\""

function tables {

#    echo -e "\n\n${CHECK}\n\n"

    RESULT="$(eval ${CHECK} 2>> /dev/null)"

    echo ${RESULT};
}

CLEAR=$(cat <<END
SET @schema = '${DB}';
SET @pattern = '%';
SET SESSION group_concat_max_len = 1000000;
SELECT CONCAT('DROP TABLE ',GROUP_CONCAT(CONCAT('\\\`',@schema,'\\\`.\\\`',table_name,'\\\`')),';')
INTO @droplike
FROM information_schema.TABLES
WHERE TABLE_SCHEMA=@schema
AND table_name LIKE @pattern;
SELECT @droplike;
PREPARE stmt FROM @droplike;
SET FOREIGN_KEY_CHECKS = 0;
EXECUTE stmt;
SET FOREIGN_KEY_CHECKS = 1;
DEALLOCATE PREPARE stmt;
END
);

CLEAR="mysql -h ${HOST} -u ${USER} -P${PORT} -p${PASS} \"${DB}\" -e \"${CLEAR}\""

ATTEMPTS="10";

{ green "\n${ATTEMPTS} attempts to remove existing tables before importing"; } 2>&3

N="1"
ERROR="";
while true
do

    TABLES="$(tables)"

    if [ "${TABLES}" = "" ]; then

        break;
    else

        { green "${N} attempt:"; } 2>&3

        RESULT="$(eval ${CLEAR} 2>> /dev/null)"
    fi

    N=$((${N} + 1));

    if [ ${N} -gt ${ATTEMPTS} ]; then

        ERROR="Database ${DB} still have tables: ${TABLES}";

        break;
    fi
done

if [ "${ERROR}" != "" ]; then

    { red "\n${0} error: ${ERROR}\n"; } 2>&3

    exit 1;
fi

{ green "\nSeems clear\n"; } 2>&3

