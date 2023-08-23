
# /bin/bash keep-running-for-at-least.sh -dt -s 15 -- /bin/bash in.sh 0 0 "one two" three "four five" a
# /bin/bash keep-running-for-at-least.sh -s 15 -- /bin/bash in.sh 0 0 "one two" three "four five" a
# -dt       supress all extra messages, except errors
# -s sec    for how log this script should remain in state running

_KEEP_RUNNING_FOR="";
_DONT_TALK="0";

PARAMS=""
while (( "${#}" )); do
  case "${1}" in
    -dt|--dont-talk)
      _DONT_TALK="1";
      shift
      ;;
    -s|--sec)
      if [ "${2}" = "" ]; then                            # optional
        echo "${0} error: --gen value can't be empty" >&2 # optional
        exit 1                                          # optional
      fi                                                # optional
      _KEEP_RUNNING_FOR="${2}";
      shift 2

      TEST="^[0-9]+$"

      if ! [[ "${_KEEP_RUNNING_FOR}" =~ ${TEST} ]]; then

          echo "${0} error: --sec \$_KEEP_RUNNING_FOR(${_KEEP_RUNNING_FOR}) don't match '${TEST}'";

          exit 1;
      fi

      if [ "${_KEEP_RUNNING_FOR}" -lt 1 ]; then

          echo "${0} error: --sec param \$_KEEP_RUNNING_FOR(${_KEEP_RUNNING_FOR}) is smaller than '1'";

          exit 1
      fi
      ;;
    --) # end argument parsing
      shift
                        while (( "${#}" )); do          # optional
                          if [ "${PARAMS}" = "" ]; then # optional
                              PARAMS="\"${1}\""         # optional
                          else                        # optional
                              PARAMS="${PARAMS} \"${1}\"" # optional
                          fi                          # optional
                          shift;                      # optional
                        done                          # optional if you need to pass: /bin/bash ${0} -f -c -- -f "multi string arg"
      break
      ;;
    -*|--*=) # unsupported flags
      echo "${0} error: Unsupported flag ${1}" >&2
      exit 1
      ;;
    *) # preserve positional arguments

      if [ "${PARAMS}" = "" ]; then
          PARAMS="\"${1}\""
      else
          PARAMS="${PARAMS} \"${1}\""
      fi
      shift
      ;;
  esac
done

if [ "${_KEEP_RUNNING_FOR}" = "" ]; then

    echo "${0} error: --sec param is not specified";

    exit 1
fi

# set positional arguments in their proper place
#eval set -- "${PARAMS}"

_START="$(date +%s)"

if [ "${_DONT_TALK}" = "0" ]; then

    echo "${0} _KEEP_RUNNING_FOR: ${_KEEP_RUNNING_FOR}"

    echo -e "COMMAND: ${PARAMS}\n\n>>>>>>"
fi

eval ${PARAMS}

_CODE="${?}"

if [ "${_DONT_TALK}" = "0" ]; then

    echo -e "<<<<<<\n\n${0} executing command:\n\n    ${PARAMS}\n"

    if [ "${_CODE}" = "0" ]; then

        printf "succeeded"
    else

        printf "failed"
    fi

    printf " with exit code: ${_CODE}\n"
fi

_TOOK=$(( $(date +%s) - ${_START} ));

_DIFF=$(( ${_KEEP_RUNNING_FOR} - ${_TOOK} ));

if [ "${_DIFF}" -gt "0" ]; then

    if [ "${_DONT_TALK}" = "0" ]; then

        echo -e "\nexecuting command:\n\n    ${PARAMS}\n\ntook less than ${_KEEP_RUNNING_FOR} seconds so lets wait another ${_DIFF} seconds\n"
    fi

    sleep "${_DIFF}"
else

    if [ "${_DONT_TALK}" = "0" ]; then

        echo -e "\nexecuting command:\n\n    ${PARAMS}\n\ntook more than ${_KEEP_RUNNING_FOR} seconds (${_TOOK} to be exact) no need to wait\n"
    fi
fi

exit ${_CODE};