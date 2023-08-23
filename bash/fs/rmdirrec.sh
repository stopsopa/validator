
# /bin/bash tools/rmdirrec.sh var/ var/a/b/g/h/
# will not remve symlinks,
# symlink along the path will stop the chain of removing directories down to the root

realpath . 1> /dev/null 2> /dev/null

if [ "${?}" != "0" ]; then

    { red "realpath is not installed run: brew install coreutils"; } 2>&3

    exit 1;
fi

TARGETDIR="$(realpath "${1}" 2>&1)"

if [ "${?}" != "0" ]; then

  echo "${0} error: realpath TARGETDIR error '${TARGETDIR}', exit code 1"

  exit 1;
fi

if [ "${1}" = "" ]; then

  echo "${0} error: target directory not specified"

  exit 1
fi

if [ ! -d "${TARGETDIR}" ]; then

  echo "${0} error: target path '${TARGETDIR}' is not a directory"

  exit 1
fi

DIRECTORYTOREMOVE="$(realpath "${2}" 2>&1)"

if [ "${?}" != "0" ]; then

  echo "${0} error: realpath DIRECTORYTOREMOVE error '${DIRECTORYTOREMOVE}', exit code 0"

  exit 0;
fi

if [ "${2}" = "" ]; then

  echo "${0} error: directory to remove parameter is not specified"

  exit 1
fi

if [ ! -d "${DIRECTORYTOREMOVE}" ]; then

  echo "${0} error: directory to remove '${DIRECTORYTOREMOVE}' is not a directory"

  exit 1
fi

TMP="$(realpath "${DIRECTORYTOREMOVE}" 2>&1)"

while true
do

#  echo "${0} error: preparing to remove ${TMP}";

  if [ "${TARGETDIR}" = "${TMP}" ]; then

#    echo "${0} error: dir is equal to destination"

    break;
  fi

  rmdir "${TMP}" 2> /dev/null 1>/dev/null

  if [ "${?}" != "0" ]; then

#    echo "${0} error: non zero exit code"

    break;
  fi

  TMP="$(dirname "${TMP}")"

  TMP="$(realpath "${TMP}" 2>&1)"
done