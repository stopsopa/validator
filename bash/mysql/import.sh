
function help {
  
cat << EOF

  /bin/bash ${0} path/to/mysql.sql
  # /bin/bash ${0} path/to/mysql.sql.tar.gz - not implemented yet

  # it is usually good idea to run before import
  (cd migrations && node recreate-db.js)

  /bin/bash ${0} path/to/mysql.sql .env.kub.prod - !!! be careful

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

set +e
set +x

cat << EOF

  HOST  "${HOST}"
  USER  "${USER}"
  PORT  "${PORT}"
  PASS  "${PASS}"
  DB    "${DB}"

EOF

if [ ! -e "${1}" ]; then

  { red "FILE: '${1}' doesn't exist"; } 2>&3

  help

  exit 1
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

{ green "\n${ATTEMPTS} attempts to remove existing tables before importing\n"; } 2>&3

N="1"
ERROR="";
while true
do

    { green "${N} attempt:"; } 2>&3

    TABLES="$(tables)"

    if [ "${TABLES}" = "" ]; then

        { green "seems clear..."; } 2>&3

        break;
    else

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

set +x
set +e

CMD="mysql -h ${HOST} -u ${USER} -P${PORT} -p${PASS} ${DB}"

printf "\nimporting from file \"${1}\"\n";

RESULT="$(${CMD} < "${1}" 2>&1)"

CODE="${?}"

printf "\n${RESULT}\n";

if [ "${CODE}" = "0" ]; then

  { green "\nAll good, exit code: 0\n"; } 2>&3

else

  if [[ ${RESULT} = *"already exists"* ]]; then

      { red "\n\nimport crashed and it looks like it might be necessary to clear the database and repeat import.\nIn order to clear database in Roderic project just run:\n\n    node migrations/recreate-db.js dangerous\n\nWARNING: make sure that you're working on correct database by running:\n\n    node migrations/recreate-db.js\n\nthis will just print database credentials without firing clearing database\n"; } 2>&3

  else

    { red "\n${0} general import error:\n\n${RESULT}\n"; } 2>&3
  fi
fi

exit ${CODE};

