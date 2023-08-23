
#
# This script will try to generate regular version without tag like
# "PROJECT_NAME-2020_01_06_01_21_56-b8d4dc2b"
#


_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"

PR="${_DIR}/../.."

set -e
#set -x

#/bin/bash "${PR}/bash/git/is-commited.sh"

source "${PR}/bash/colours.sh"

source "${PR}/bash/time-format.sh"

source "${PR}/.env"

if [ "${PROJECT_NAME}" = "" ]; then

    { red "\n    PROJECT_NAME environment variable is empty or doesn't exist\n"; } 2>&3

    exit 1;
fi

HSH="$(git rev-parse --short HEAD)"

VER="${PROJECT_NAME}-$(_datetime _)-${HSH}";
echo ${VER}