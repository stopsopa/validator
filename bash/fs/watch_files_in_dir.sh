#!/bin/bash

realpath . &> /dev/null

if [ "${?}" != "0" ]; then

    { red "realpath is not installed run: brew install coreutils"; } 2>&3

    exit 1;
fi

HELP="$(inotifywait --help 2>&1)"

REG="Wait for a particular event"

if ! [[ ${HELP} =~ ${REG} ]]; then

  echo -e "\n${0} error: inotifywait tool is not available, visit: https://github.com/inotify-tools/inotify-tools/wiki for installation instruction\n";

  exit 1;
fi

if [ ! -d "${1}" ]; then

  echo "first argument '${1}' is not a directory";

  exit 1;
fi

DIR="${1}";

shift;

if [ ! -f "${1}" ]; then

  echo "second argument '${1}' is not a bash script";

  exit 1;
fi

SCRIPT="${1}";

shift;

REG="ISDIR"

inotifywait -mr -e delete -e attrib -e modify "${DIR}" | while read -r dir action file; do

  if ! [[ ${action} =~ ${REG} ]]; then

    TIME="$(date +"%Y-%m-%d %H:%M:%S")";

    /bin/bash "${SCRIPT}" "$(realpath "${dir}")" "${file}" "${action}";

    echo "=== ${0} ${TIME} ${action} ${file} exit code: ${?}";
  fi
done

