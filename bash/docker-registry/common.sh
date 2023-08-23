
set -e

_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"

_ENV="${_DIR}/../../.env"

if [ -e "${_ENV}" ]; then

  source "${_ENV}";
fi

if [ "${PROTECTED_DOCKER_REGISTRY_BASICAUTH_HEADER}" = "" ]; then

    echo "ERROR: PROTECTED_DOCKER_REGISTRY_BASICAUTH_HEADER is not defined or is empty";

    exit 1;
fi

if [ "${PROTECTED_DOCKER_REGISTRY}" = "" ]; then

    echo "ERROR: PROTECTED_DOCKER_REGISTRY is not defined or is empty";

    exit 1;
fi