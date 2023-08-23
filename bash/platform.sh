
PLATFORM="$(uname -m)"

echo "${PLATFORM}"

if [ "${PLATFORM}" = "x86_64" ]; then

  DOCKER_PLATFORM="linux/amd64"
fi

if [ "${PLATFORM}" = "arm64" ]; then

  DOCKER_PLATFORM="linux/arm64"
fi

if [ "${DOCKER_PLATFORM}" = "" ]; then

  echo "${0} error: DOCKER_PLATFORM is not detected"

  exit 1
fi

echo "${DOCKER_PLATFORM}"