
# USE LIKE:
# /bin/bash ${0} ${HEADLINES} ${TAILLINES} /bin/bash other.sh arg1 arg2 ...
# /bin/bash ${0} ${HEADLINES} ${TAILLINES} node script.js arg1 arg2 ...

# WARNING:
# BE AWARE THAT STDOUT AND STDERR OF INTERNAL COMMAND
# ARE OUTPUTED FROM THIS SCRIPT ON ITS STDOUT
# WARNING:

trim() {
    local var="${*}"
    # remove leading whitespace characters
    var="${var#"${var%%[![:space:]]*}"}"
    # remove trailing whitespace characters
    var="${var%"${var##*[![:space:]]}"}"
    echo -n "${var}"
}

if [ "${#}" -lt "2" ]; then

    echo -e "\ngive any command to execute like\n\n    /bin/bash ${0} 40 40 /bin/bash script.sh\n\n"

    exit 1
fi

HEAD="${1}"

if [[ ! "${HEAD}" =~ ^[0-9]+$ ]]; then

    echo -e "limit '${HEAD}' (first argument) is not a number > 0\n"

    exit 1
fi

shift;

TAIL="${1}"

if [[ ! "${TAIL}" =~ ^[0-9]+$ ]]; then

    echo -e "limit '${TAIL}' (second argument) is not a number > 0\n"

    exit 1
fi

shift;

OUT="$(${@} 2>&1)"

EXITCODE=${?}

LINES="$(echo "${OUT}" | wc -l)"
LINES="$(trim ${LINES})"

SUM=$((${HEAD+}${TAIL}))

#echo "LINES=${LINES}"
#echo "SUM=${SUM}"
#echo "OUT=${OUT}"

if [ "${LINES}" -gt "${SUM}" ]; then

    printf "${OUT}" | head -n ${HEAD};

    echo "==== and $((${LINES}-${SUM})) lines more ==="

    printf "${OUT}" | tail -n ${TAIL};
else

    printf "${OUT}";
fi

echo ""

exit ${EXITCODE}
