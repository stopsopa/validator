
#  /bin/bash bash/exist-in-file.sh ../.idea/hub.iml 'MODULE_DIR'
#
# exit code
#    0 if file exist and if found or not found string - print to terminal 1 or 0 accordingly
#    1 - not enough arguments - min 2
#    2 - if file is missing
#    3 - second argument can't be empty string


_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"

source "${_DIR}/trim.sh"

if [ ${#} -lt 2 ] ; then

    echo "not enough arguments";

    exit 1;
fi

FILE="${1}";

if [ ! -e "${FILE}" ]; then  # exist

    echo "FILE: '${FILE}' doesn't exist"

    exit 2;
fi

shift;

FIND="${1}"

FIND="$(trim ${FIND})"

if [ "${FIND}" = "" ]; then

    echo "FIND argument can't be empty string"

    exit 3;
fi

shift;

if [ "$(grep "${FIND}" "${FILE}")" = "" ]; then

  echo '0'
else

  echo '1'
fi

