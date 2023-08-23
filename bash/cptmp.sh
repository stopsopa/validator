
# call with one argument, script will return value of environment variable from .env under ${1} name variable
# /bin/bash bash/env.sh ../.env PROTECTED_MYSQL_HOST

openssl help 1> /dev/null 2> /dev/null

if [ "${?}" != "0" ]; then

  echo "${0} error: openssl is not installed"

  exit 1
fi

if [ "${1}" = "--help" ]; then

cat << EOF

It's just copying file next to original to do whatever you want with it without changing original

WARNING: actually this script just generates new filepath for tmp file and check if there is
nothing existing already under this path

--clean - will remove prevously generated files, example:
  for file: ttt.sh
  it will remove previously generated files:
    ttt-gen-67ac.sh
    ttt-gen-74ab.sh

--gen - will change default sufix from "-gen-" to..., examples:
  --gen test -> "-test-"  --> will generate file like: ttt-test-74ab.sh
  --gen fooo -> "-fooo-"  --> will generate file like: ttt-fooo-74ab.sh

TMP="\$(/bin/bash ${0} .env --clear)"
TMP="\$(/bin/bash ${0} .env --clean)"
TMP="\$(/bin/bash ${0} .env -c)"
TMP="\$(/bin/bash ${0} .env --gen 'gen')"
TMP="\$(/bin/bash ${0} .env -g 'gen')"
TMP="\$(/bin/bash ${0} .env -g 'gen' -c)"

# do something
function cleanup {
    echo "cleanup...";
    unlink "\$TMP" || true
}
trap cleanup EXIT

EOF

    exit 0
fi

_CLEANOLD="0";

_GEN="gen"

PARAMS=""
while (( "${#}" )); do
  case "${1}" in
    -c|--clean|--clear)
      _CLEANOLD="1";
      shift
      ;;
    -g|--gen)
      if [ "${2}" = "" ]; then
        echo "${0} error: --gen value can't be empty" >&2
        exit 1
      fi
      _GEN="${2}";
      shift 2
      ;;
    --) # end argument parsing
      shift
      break
      ;;
    -*|--*=) # unsupported flags
      echo "${0} error: Unsupported flag ${1}" >&2
      exit 1
      ;;
    *) # preserve positional arguments
      PARAMS="${PARAMS} ${1}"
      shift
      ;;
  esac
done

# set positional arguments in their proper place
eval set -- "${PARAMS}"

_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"

#realpath . 1> /dev/null 2> /dev/null
#
#if [ "${?}" != "0" ]; then
#
#    { red "realpath is not installed run: brew install coreutils"; } 2>&3
#
#    exit 1;
#fi

set -e



#P="$(realpath -m "${FILE}")"
PD="$(dirname "${1}")"
PB="$(basename "${1}")"
# https://stackoverflow.com/a/965069
# https://math-linux.com/linux/bash/article/how-to-get-or-extract-filename-and-extension-in-bash
EXTENSION="${PB##*.}"
FILENAME="${PB%.*}"
if [ "${FILENAME}" = "" ]; then
  FILENAME="${PB}"
  EXTENSION=""
fi
if [ "${FILENAME}" = "${PB}" ]; then
  EXTENSION=""
fi

#EXTENSION="$(echo -n "${EXTENSION}" | tr '[:upper:]' '[:lower:]')"

#echo "PD ='${PD}'";
#echo "PB ='${PB}'";
#echo "FILENAME ='${FILENAME}'";
#echo "EXTENSION ='${EXTENSION}'";






if [ "${_CLEANOLD}" = "1" ]; then

    PREG="$(/bin/bash "${_DIR}/preg_quote.sh" "${FILENAME}")"

    EREG=""
    if [ "${EXTENSION}" != "" ]; then
      EREG="\.$(/bin/bash "${_DIR}/preg_quote.sh" "${EXTENSION}")"
    fi

    CLEARLIST="$(find -L "${PD}" -type f -maxdepth 1 | sed -nE "/\/${PREG}-${_GEN}-[a-f0-9]{4}${EREG}$/p")"

    for file in ${CLEARLIST}
    do
        unlink "${file}" || true
    done
fi

#echo "FILE ${FILE}"
#echo "PD ${PD}"
#echo "PB ${PB}"
#echo "EXTENSION ${EXTENSION}"
#echo "FILENAME ${FILENAME}"

TMPFILE=""

while true
do
    EX=""
    if [ "${EXTENSION}" != "" ]; then
      EX=".${EXTENSION}"
    fi
    TMPFILE="${PD}/${FILENAME}-${_GEN}-$(openssl rand -hex 2)${EX}"

    if [ ! -e "${TMPFILE}" ]; then  # not exist (fnode, directory, socket, etc.)

        echo ${TMPFILE}

        exit 0;
    fi
done