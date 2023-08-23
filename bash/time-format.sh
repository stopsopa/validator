
# I would like rather use stateful function but I have completely idea how to do this in bash
# but this is just for testing so doing this ugly way is still acceptable

# _datetime
# 2019-12-04 14:05:08

# _datetime " <AA> "
# 2019 <AA> 12 <AA> 04 <AA> 14 <AA> 05 <AA> 08

# _datetime " <AA> " " <BB> "
# 2019 <AA> 12 <AA> 04 <AA> 14 <BB> 05 <BB> 08

# _datetime " <AA> " " <BB> " " <CC> "
# 2019 <AA> 12 <AA> 04 <BB> 14 <CC> 05 <CC> 08

# _datetime -
# 2019-12-04-14-05-08

function _datetime {

    H="-"

    S=" "

    C=":"

    if [ "${1}" != "" ]; then

      H="${1}"

      S="${1}"

      C="${1}"
    fi

    if [ "${2}" != "" ]; then

      C="${2}"
    fi

    if [ "${3}" != "" ]; then

      S="${2}"

      C="${3}"
    fi

    date "+%Y${H}%m${H}%d${S}%H${C}%M${C}%S"
}

function _date {
    date "+%Y-%m-%d"
}

function _time {
    date "+%H-%M-%S"
}

if [ "${TRAVIS}" == "true" ]; then


    _DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"
    TMP_FILE="${_DIR}/tmp.counter"

    if [ ! -f ${TMP_FILE} ]; then

        echo '0' > ${TMP_FILE}
    fi

    if [ ! -f ${TMP_FILE} ]; then

        printf "\n\n    can't create tmp file: ${TMP_FILE} \n\n";

        exit 1
    fi

    function _datetime {

        COUNTER="$(cat ${TMP_FILE})"

        echo "__${COUNTER}__"

        COUNTER=$((${COUNTER} + 1))

        echo ${COUNTER} > ${TMP_FILE}
    }
    function _date {
        _datetime
    }
    function _time {
        _datetime
    }
fi
