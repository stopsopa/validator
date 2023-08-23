
realpath . &> /dev/null

if [ "${?}" != "0" ]; then

    { red "realpath is not installed run: brew install coreutils"; } 2>&3

    exit 1;
fi

openssl help 1> /dev/null 2> /dev/null

if [ "${?}" != "0" ]; then

  echo "${0} error: openssl is not installed"

  exit 1
fi

function help {

cat << EOF

/bin/bash ${0} deploymentname [number-of-container = default 0]

Will return empty string and non 0 exit code if deployment doesn't exist of connection failed

EOF
}

if [ "${1}" = "--help" ]; then

    help;

    exit 0;
fi

if [ "${1}" = "" ]; then

    echo "${0} error: name of deployemnt not specified"

    help;

    exit 1;
fi

CONTAINER="0";

if [ "${2}" != "" ]; then

    CONTAINER="${2}"
fi

_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"

set -e

FILE="${_DIR}/$(openssl rand -hex 2).log";

FILE="$(realpath "${FILE}")"

DELETE=("${FILE}");

function cleanup {

  for i in "${DELETE[@]}"
  do

      unlink "${i}" || true
  done
}

trap cleanup EXIT;

kubectl get deploy "${1}" -o yaml 2>> "${FILE}" 1>> "${FILE}";

node "${_DIR}/getyaml.js" "${FILE}" _ spec.template.spec.containers.${CONTAINER}.image plain | sed -E 's/^(.*:)?(.*)$/\2/'

