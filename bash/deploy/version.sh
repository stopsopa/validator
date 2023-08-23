
#
# This script is just trying to get latest REMOTE tag based on:
# - PROJECT_NAME from .env
# - current branch
# - and remote respository given in first mandatory arg passed to the script
#
# WARNING; this script is not generating next version of the project, in order to achieve this you still have to
# pass output of this script through bash/semver.sh
#


_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"

PR="${_DIR}/../.."

set -e
#set -x

#/bin/bash "${PR}/bash/git/is-commited.sh"

source "${PR}/bash/colours.sh"

source "${PR}/bash/trim.sh"

source "${PR}/.env"

if [ "${PROJECT_NAME}" = "" ]; then

    { red "\n    PROJECT_NAME environment variable is empty or doesn't exist\n"; } 2>&3

    exit 1;
fi

if [ ${#} -lt 1 ]; then

    { red "\nnot enough arguments\n    /bin/bash ${0} origin major|minor|patch\n"; } 2>&3

    exit 1;
fi

REMOTE="${1}";

shift;

if [ "${REMOTE}" = "" ]; then

    { red "\n    you have to specify REMOTE\n"; } 2>&3

    exit 1;
fi

#MODE="${1}";
#
#shift;
#
#if [ "${MODE}" = "" ]; then
#
#    { red "\n    you have to specify MODE (major|minor|patch)\n"; } 2>&3
#
#    exit 1;
#fi
#
#TEST="^(patch|minor|major)$"
#
#if ! [[ ${MODE} =~ ${TEST} ]]; then
#
#    { red "\n    MODE: should match one of values (patch|minor|major) but it is >>>${MODE}<<<\n"; } 2>&3
#
#    exit 1;
#fi

BRANCH="$(git rev-parse --abbrev-ref HEAD)"

if [ "${BRANCH}" = "HEAD" ]; then

    { red "\n    BRANCH is HEAD, you are beyound branches\n"; } 2>&3

    exit 1;
fi

BRANCH="-${BRANCH}";

if [ "${BRANCH}" = "-master" ]; then

    BRANCH="";
fi

#VER="$(git ls-remote --tags ${REMOTE} | grep -v "\\^{}$")" || true
VER="$(git ls-remote --tags --refs ${REMOTE)}"

# project-6.4.32-dev - so I'm filtering here last "-dev"
if [ "${BRANCH}" != "" ]; then

    VER="$(printf "${VER}" | grep "\\$BRANCH$")" || true
fi

#PROJECT_NAME='v'; # for test

# project-6.4.32-dev - so I'm filtering here "project-" from the beginning
VER="$(printf "${VER}" | grep "/${PROJECT_NAME}-")" || true
    # test: printf "df /x/proj-9.4.3-dev\n/x/proj8.8.8-dev\n/x/proj-4.5.4-prod" | grep "/proj-" || true

# after this line VER will be equal: >>17a643f754129ef984f6f0c0a04e082719f03745	refs/tags/v0.1.99<<
VER="$(printf "${VER}" | tail -n 1)"

VER="$(printf "${VER}" | cut -d '/' -f3)"

VER="$(trim "${VER}")"

if [ "${VER}" = "" ]; then

    VER="${PROJECT_NAME}-0.0.0-${BRANCH}";

fi

printf ${VER}
