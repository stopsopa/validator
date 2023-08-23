
if [ "${1}" = "" ] || [ "${1}" = "--help" ]; then

cat <<EOF

Script will try to detect wget then url, and use first found tool to download a file from url

/bin/bash "${0}" https?://domain.com/path/to/file.txt [optional target path to save]

EOF

  exit 1
fi

exec 3<> /dev/null
function green {
  printf "\e[32m${1}\e[0m\n"
}

function red {
  printf "\e[31m${1}\e[0m\n"
}

function yellow {
  printf "\e[33m${1}\e[0m\n"
}

if [ "${1}" = "" ]; then

  { red "${0} error: url not specified"; } 2>&3

  set -e; _exit 1> /dev/null 2> /dev/null
fi

__METHOD="wget"

wget --help 1> /dev/null 2> /dev/null

if [ "${?}" != "0" ]; then

  curl --help 1> /dev/null 2> /dev/null

  if [ "${?}" != "0" ]; then

    { red "${0} error: wget nor curl found"; } 2>&3

    set -e; _exit 1> /dev/null 2> /dev/null
  fi

  __METHOD="curl";
fi

set -e

if [ "${2}" = "" ]; then

  if [ "${__METHOD}" = "wget" ]; then

    echo ${0} wget mode

    wget "${1}"
  else

    echo ${0} curl mode

    curl "${1}" -o "$(basename $(echo "${1}" | sed -E 's/([^\?]*)(\?.*)/\1/'))"
  fi
else

  mkdir -p "$(dirname "${2}")"

  if [ "${__METHOD}" = "wget" ]; then

    echo ${0} wget mode

    wget --no-cache -O "${2}" "${1}"
  else

    echo ${0} curl mode

    curl "${1}" -o "${2}"
  fi
fi
