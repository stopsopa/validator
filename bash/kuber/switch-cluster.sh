
if [ "${1}" = "" ]; then

  echo "${0} error: no arguments given";

cat << EOF

  # usage
  /bin/bash ${0} cluster-name
  /bin/bash ${0} cluster-name [number of attempts to list nodes = default 5]

EOF

  exit 1;
fi

set -o pipefail

_CMD="doctl kubernetes cluster list --format \"Name\" --no-header"

_LIST="$(eval "${_CMD}")"

_CODE="${?}"

if [ "${_CODE}" != "0" ]; then

    echo ""
    echo "${0} error:"
    echo -e "command:\n    ${_CMD}"
    echo "has crushed with status code: >>${_CODE}<<"
    echo ""

    exit ${_CODE};
fi

echo "LIST OF CLUSTERS:"
echo "${_LIST}"
echo ""

_TMP="$(echo "${_LIST}" | grep "${1}")"

if [ "${_TMP}" = "" ]; then

  echo -e "${0} error: cluster name '${1}' is not on the list of available clusters:\n${_LIST}\n";

  exit 1;
fi

echo "cluster '${1}' found on the list, switching..."

NUM="5"

_TEST="^[0-9]+$"

if [ "${2}" != "" ]; then

  if ! [[ ${2} =~ ${_TEST} ]]; then

      echo "${0} error: NUM argument given (${2}) but it doesn't match (${_TEST})"
      echo ""

      exit 1;
  fi

  if [ ${2} -lt 2 ] ; then

      echo "${0} error: NUM argument given (${2}) but it is smaller than 2"
      echo ""

      exit 1;
  fi

  NUM="${2}"
fi

echo -e "running until successful ${NUM} times\n\n    kubectl get no"

for i in $(seq 1 1 ${NUM})
do

  echo -e "\nattempt ${i}:"

  doctl kubernetes cluster kubeconfig save "${1}"

  kubectl get no

  _CODE="${?}"

  if [ "${_CODE}" = "0" ]; then

      echo "switched..."
      exit 0;
  fi

  sleep 3;
done

echo -e "\n${0} error: failed to switch to cluster [${1}], exit code [${_CODE}]"

exit ${_CODE};




