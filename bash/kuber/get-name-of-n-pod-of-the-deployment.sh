
# for future improvements
# https://kubernetes.io/docs/concepts/workloads/controllers/job/#running-an-example-job
# pods=$(kubectl get pods --selector=job-name=pi --output=jsonpath='{.items[*].metadata.name}')
# echo ${pods}

if [ "${1}" = "--help" ]; then

cat << EOF

/bin/bash ${0} name-of-deployment
   will return first pod name

/bin/bash ${0} name-of-deployment all
   will return all pods

/bin/bash ${0} name-of-deployment 1 [namespace]
   will return first pod name from particular namespace

   INFO: 1 is latest

/bin/bash ${0} name-of-deployment all [namespace]
   obviously will return all pods name from particular namespace

[namespace] - if namespace is not given then it search through default namespace

EOF

    exit 0;
fi

NAMESPACE=""

if [ "${1}" = "-n" ]; then

  NAMESPACE=" -n ${2}"

  shift;

  shift;
fi

if [ "${1}" = "" ]; then

    echo "${0} error: name of deployment is not specified - first argument"

    exit 1
fi

DEPLOY="${1}"

shift;

NUM="${1}"
if [ "${NUM}" = "" ]; then
    NUM="1"
fi

shift;

if [ "${NUM}" != "" ] && [ "${NUM}" != "all" ] ; then

    TEST="^[0-9]+$"
    if ! [[ ${NUM} =~ ${TEST} ]]; then

        echo "${0} error: number param(${NUM}) is not a number or 'all'"

        exit 1;
    fi
fi

N="${1}"

#AWK="{print \$2}"
AWK="{print \$2,\" \",\$8}"

if [ "${N}" != "" ]; then
    if [ "${N}" = "all" ]; then
        N=" -A"
    else
        N=" -n \"${N}\""
    fi
else
    N=""
#    AWK="{print \$1}"
    AWK="{print \$1,\" \",\$7}"
fi

shift;

set -e
set -o pipefail

#echo "kubectl get pod${N} -o wide --sort-by=.metadata.creationTimestamp | tail -n +2 | tac | awk '${AWK}' | sed -nE \"/^${DEPLOY}-/p\""

CMD="kubectl get pod${N}${NAMESPACE} -o wide --sort-by=.metadata.creationTimestamp | tail -n +2 | tac | awk '${AWK}' | sed -nE \"/^${DEPLOY}-/p\"";

LIST="$(eval ${CMD})"

if [ "${NUM}" = "all" ]; then

    echo "${CMD}"

    echo "${LIST}"

    exit 0
fi

#echo "${CMD}"

COUNT="$(echo "${LIST}" | wc -l)"

trim() {
    local var="${*}"
    # remove leading whitespace characters
    var="${var#"${var%%[![:space:]]*}"}"
    # remove trailing whitespace characters
    var="${var%"${var##*[![:space:]]}"}"
    echo -n "${var}"
}

COUNT="$(trim "${COUNT}")"

if [ "${NUM}" -gt "${COUNT}" ] ; then

    NUM="${COUNT}"
fi

#echo "DEPLOY=${DEPLOY}"
#echo "NUM=${NUM}"
#echo "N=${N}"
#echo ">>${COUNT}<<"
#
#echo "${LIST}"
#
#echo ----

echo "${LIST}" | sed "${NUM}!d" | awk '{print $1}'


