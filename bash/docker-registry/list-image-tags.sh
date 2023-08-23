
#set -e

if [ "${1}" = "" ]; then

    echo "please provide image name in first argument"

    exit 1;
fi

_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"

_ROOT="${_DIR}/.."

_TMPJSONFILE="${_DIR}/tmp-${1}.json"

if [ -e "${_TMPJSONFILE}" ]; then

    unlink "${_TMPJSONFILE}";
fi

if [ -e "${_TMPJSONFILE}" ]; then

    echo "ERROR: ${_TMPJSONFILE} still exists"

    exit 1;
fi

source "${_DIR}/common.sh";

#PROTECTED_DOCKER_REGISTRY="dd${PROTECTED_DOCKER_REGISTRY}"

set +e

_STATUSCODE="$(curl -s -L -H "authorization: Basic ${PROTECTED_DOCKER_REGISTRY_BASICAUTH_HEADER}" --write-out %{http_code} --silent --output /dev/null ${PROTECTED_DOCKER_REGISTRY}/v2/${1}/tags/list)"

set -e

#echo ">>${_STATUSCODE}<<"

if [ "${_STATUSCODE}" = "404" ]; then

  exit 0;
fi

if [ "${_STATUSCODE}" = "200" ]; then

  function cleanup {

      unlink "${_TMPJSONFILE}";
  }

  trap cleanup EXIT;

  curl -s -L -H "authorization: Basic ${PROTECTED_DOCKER_REGISTRY_BASICAUTH_HEADER}" "${PROTECTED_DOCKER_REGISTRY}/v2/${1}/tags/list" > "${_TMPJSONFILE}"

  LIST="$(node "${_ROOT}/node/json/get.js" "${_TMPJSONFILE}" tags | node "${_ROOT}/node/sortsemver.js")";

  LIST_ARRAY=(${LIST//$'\n'/ })

  for i in "${LIST_ARRAY[@]}"
  do
      _TMP="$(echo "${i}" | sed "s/[][,\"]//g")"

      if [ "${_TMP}" != "" ]; then

        echo "${_TMP}";
      fi
  done

#  echo 'somethingelse'

  exit 0;
fi

echo "ERROR: couldn't get list of tags of repository '${1}'"

exit 1


