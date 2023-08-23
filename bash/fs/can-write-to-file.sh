
# purpose of this library is to check whether I will be able to write to file like
# echo 'test' > log.log
# echo 'test' >> log.log
# --rm flag will try to first remove file and then check if it will be possible to create it


# template of using it as a library vvv

  #_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"
  #
  #_MAINLIBDIR="$(dirname "${_DIR}")"
  #
  #A="${_DIR}/a.tmp"
  #
  #B="${_DIR}/b.tmp"
  #
  #/bin/bash "${_MAINLIBDIR}/fs/can-write-to-file.sh" --rm "${A}"
  #
  #/bin/bash "${_MAINLIBDIR}/fs/can-write-to-file.sh" --rm "${B}"
  #
  #function cleanup {
  #
  #    /bin/bash "${_MAINLIBDIR}/fs/can-write-to-file.sh" --rm "${A}"
  #
  #    /bin/bash "${_MAINLIBDIR}/fs/can-write-to-file.sh" --rm "${B}"
  #}
  #
  #trap cleanup EXIT
  #
  #set -e

# template of using it as a library ^^^

realpath . &> /dev/null

if [ "${?}" != "0" ]; then

    { red "realpath is not installed run: brew install coreutils"; } 2>&3

    exit 1;
fi

RM="0"
if [ "${1}" = "--rm" ]; then

  shift;

  RM="1"
fi

___DIR="$(dirname "${1}")"

___REALFILE="$(realpath "${1}")"

___REALDIR="$(realpath "${___DIR}")"

___BASENAME="$(basename "${0}")"

if [ -e "${1}" ]; then

  if [ "${RM}" = "1" ]; then

    unlink "${1}"

    if [ -e "${1}" ]; then

      echo "${___BASENAME} error: can't remove file '${___REALFILE}'"

      exit 1
    fi

    if [ -w "${___DIR}" ]; then

      exit 0;
    fi

    echo "${___BASENAME} error 2: don't have write access to directory '${___REALDIR}'"

    exit 1;
  else

    if [ -w "${1}" ]; then

      exit 0;
    fi

    echo "${___BASENAME} error 3: don't have write access to file '${___REALFILE}'"

    exit 1;
  fi
else

  if [ -w "${___DIR}" ]; then

    exit 0;
  fi

  echo "${___BASENAME} error 1: don't have write access to directory '${___REALDIR}'"

  exit 1;
fi