

realpath . 1> /dev/null 2> /dev/null

if [ "${?}" != "0" ]; then

    { red "realpath is not installed run: brew install coreutils"; } 2>&3

    exit 1;
fi

# /bin/bash ${0} kubersecretname .env.kub .env.targetnameoffileinsecret
# /bin/bash ${0} kubersecretname .env.kub .env.targetnameoffileinsecret [.env.kub .env.targetnameoffileinsecret] [.env.kub .env.targetnameoffileinsecret]
#                                                                      ^                                       ^
#                                                                      |-- optional another pair of files      |-- and another
# 2 equivalent examples:
#   /bin/bash roderic-project/bash/kuber/create-secret-with-files-inside.sh testtest roderic-project/.env.kub .env roderic-project/.env.prod .env.proddd
#   /bin/bash bash/kuber/create-secret-with-files-inside.sh testtest .env.kub .env .env.prod .env.proddd


# you might also consider using native command with --from-env-file=...
# example:
#         kubectl create secret generic my-secret --from-env-file=path/to/bar.env
# more:
#         kubectl create secret generic --help

NAMESPACE=""

if [ "${1}" = "-n" ]; then

  NAMESPACE=" -n ${2}"

  shift;

  shift;
fi

if [ "${1}" = "" ]; then

    echo "name of secret is not given - first argument is not passed to the script"

    exit 1;
fi

    #SECRET="env-${PROJECT_NAME_SHORT}";  # !!!!!!!!!!!!!!!!!!!!!!!!!

SECRET="${1}"

shift;

if [ "${1}" = "" ]; then

    echo "not even one file is given - second argument is not passed to the script"

    exit 1;
fi

if [ "$(( ${#} % 2 ))" != "0" ]; then

    echo "number of arguments should come in pairs - number of remaining arguments (except secret name) are not even"

    exit 1;
fi

_PWD="$(pwd)"

_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"

if ! [ -w "${_DIR}" ]; then

    echo "directory '${_DIR}' is not writtable"

    exit 1;
fi

DELETE=();

function cleanup {

  printf "\n    cleanup\n"

  set +x

  for i in "${DELETE[@]}"
  do

      echo -e "\nremoving '${i}'";

      unlink "${i}" || true
  done
}

trap cleanup EXIT;

# --from-file="${TMPFILE}"
FROMFILE="";

FIRST="1";
SOURCEFILE=""
TARGETNAME=""
while true; do

    PARAM="${1}"

    shift;

    if [ "${FIRST}" = "1" ]; then

        SOURCEFILE="$(realpath -m "${PARAM}")"
    else

        if [ ! -e "${SOURCEFILE}" ]; then

            echo "${0} error: file: '${SOURCEFILE}' doesn't exist"

            exit 1;
        fi

        TARGETNAME="$(basename "${SOURCEFILE}")"

        if [ "${TARGETNAME}" != "${PARAM}" ]; then

            TMPFILE="${_DIR}/${PARAM}"

            if [ -e "${TMPFILE}" ]; then

                echo "${0} error: can't create file: '${TMPFILE}' it already exist"

                exit 1;
            fi

            cp "${SOURCEFILE}" "${TMPFILE}"

            DELETE+=("${TMPFILE}");

            SOURCEFILE="${TMPFILE}"
        fi

        if [ "${FROMFILE}" != "" ]; then

            FROMFILE="${FROMFILE} ";
        fi

        FROMFILE="${FROMFILE}--from-file=\"${SOURCEFILE}\"";
    fi

    if [ "${#}" = "0" ]; then

        break;
    fi

    if [ "${FIRST}" = "0" ]; then
        FIRST="1";
    else
        FIRST="0";
    fi

done

set -e
set -x

# https://stackoverflow.com/a/45881259
kubectl create secret generic "${SECRET}" ${FROMFILE}${NAMESPACE} --dry-run -o yaml | kubectl apply -f -

kubectl get secrets

kubectl describe secret "${SECRET}"

set +x

echo -e "\n    all good\n"
