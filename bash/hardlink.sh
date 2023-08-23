
# just run this script in main directory of any git repository
# where you would like to link all files from this directory
#     /bin/bash ../../z_helpers/hardlink.sh
# or use alias, to run it from any directory,
# more about this you will find if you use --help parameter with this script

realpath . 1> /dev/null 2> /dev/null

if [ "${?}" != "0" ]; then

    { red "realpath is not installed run: brew install coreutils"; } 2>&3

    exit 1;
fi

exec 3<> /dev/null
function green {
    printf "\e[32m${1}\e[0m"
}

function red {
    printf "\e[31m${1}\e[0m"
}

function yellow {
    printf "\e[33m${1}\e[0m"
}

_SHELL="$(ps "${$}" | grep "${$} " | grep -v grep | sed -rn "s/.*[-\/]+(bash|z?sh) .*/\1/p")"; # bash || sh || zsh
case ${_SHELL} in
  zsh)
    _DIR="$( cd "$( dirname "${(%):-%N}" )" && pwd -P )"
    _SCRIPT="${(%):-%N}"
    _BINARY="/bin/zsh"
    ;;
  sh)
    _DIR="$( cd "$( dirname "${0}" )" && pwd -P )"
    _SCRIPT="${0}"
    _BINARY="/bin/sh"
    ;;
  *)
    _DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"
    _SCRIPT="${BASH_SOURCE[0]}"
    _BINARY="/bin/bash"
    ;;
esac

_SCRIPTBASENAME="$(basename "${_SCRIPT}")"

_CWD="$(pwd -P)"

if [ "${1}" = "" ]; then

  if [ "${2}" = "" ]; then

    ALIAS="hardlink"
  else

    ALIAS="${2}"
  fi

  USERDIR="$(eval "realpath ~")"

  if [ "${_SHELL}" = "zsh" ]; then

    RCFILE="${USERDIR}/.zshrc";
  else

    RCFILE="${USERDIR}/.bashrc";
  fi

  { green "\n# to install alias run:\n"; } 2>&3

cat <<EOF

 cat <<WRITE >> "${RCFILE}"
alias hardlink="${_BINARY} \"${_DIR}/$(basename "${0}")\""
WRITE

source "${RCFILE}"
alias
EOF

  { green "\n# then you can run one of commands:\n"; } 2>&3

cat <<EOF

hardlink bring

  # will bring/link all libraries* to cwd* directory as a filesystem hardlinks

hardlink link

  # will try to make sure that ONLY files present in cwd* are properly linked to libraries* by filenames as a filesystem hardlinks
  # works like "hardlink bring" but "bring" mode is mounting all libraries* to cwd* but "link" command is just trying to make sure
  # to check hardlinks of existing files in cwd*

hardlink unlink

  # will try unlink hardlinked libraries from cwd* and leave file as is but with single inode, by copying in place from target library*

hardlink source

  # will try to copy files from cwd* to libraries* which doesn't exist in library* directory


cwd - current working directory - directory where you have called/executed the hardlink alias
repository - directory where hardlink.sh is. It is expected that libraries maintained by this script will be in the same directory
EOF

  set -e; _exit 1> /dev/null 2> /dev/null
fi

git --help 1> /dev/null 2> /dev/null

if [ "${?}" != "0" ]; then

  { red "git is not installed"; } 2>&3

  set -e; _exit 1> /dev/null 2> /dev/null
fi

git diff --exit-code 1> /dev/null 2> /dev/null

if [ "${?}" = "129" ]; then

  { red "can't run this script in directory not tracked with git"; } 2>&3

  set -e; _exit 1> /dev/null 2> /dev/null
fi

if [ -f "${_CWD}/.git/config" ]; then

  { yellow ".git/config detected, creating helpers directory\n"; } 2>&3

  mkdir -p helpers

  _CWD="${_CWD}/helpers";
fi

CODE="0";

trim() {
    local var="${*}"
    # remove leading whitespace characters
    var="${var#"${var%%[![:space:]]*}"}"
    # remove trailing whitespace characters
    var="${var%"${var##*[![:space:]]}"}"
    echo -n "${var}"
}

function link {
  (
    cd "${_CWD}"

    RELATIVE="$(node -e "var p=require('path');process.stdout.write(p.relative(\"${_CWD}\", p.resolve(\"${_DIR}\", \"${1}\")))")"

    TRY_TO_LINK="0";

    echo -n "${1} "

    if [ -f "${1}" ]; then

      INODES="$(ls -l "${1}" | awk '{ print $2 }')"

      if [ "${INODES}" = "1" ]; then

        git diff --exit-code "${1}" 1> /dev/null 2> /dev/null

        if [ "${?}" = "0" ]; then # file is not changed

          diff "${RELATIVE}" "${1}" > /dev/null

          if [ "${?}" = "0" ]; then # file is not changed

            TRY_TO_LINK="1"

            { green "1 inode "; } 2>&3
          else

            { red "can't link file '${1}' to '${RELATIVE}' because files content is different\n"; } 2>&3

            return 1
          fi

        else # there is git diff - file has changed

          { red "file is modified locally, can't relink because local changes will be lost\n"; } 2>&3

          return 1
        fi
      else

        { green "${INODES} inodes - already linked\n"; } 2>&3
      fi
    else

      { green "file missing "; } 2>&3

      TRY_TO_LINK="1"
    fi

    if [ "${TRY_TO_LINK}" = "1" ]; then

      mkdir -p "$(dirname "${1}")"

      rm -rf "${1}"

      { yellow "linking ${RELATIVE}\n"; } 2>&3

      ln "${RELATIVE}" "${1}"
    fi
  )
}

if [ "${1}" = "bring" ]; then

  cd "${_DIR}"

  echo;

  LIST="$(find . -type f | grep -v "${_SCRIPTBASENAME}")"

  echo -e "${LIST}" | while read FILE ; do

    link "${FILE}"

    _RET="${?}"

    if [ "${_RET}" != "0" ]; then

      CODE="${_RET}";
    fi

  done

  echo;

  exit ${CODE}
fi

if [ "${1}" = "link" ]; then

  cd "${_CWD}"

  LIST="$(find . -type f | grep -v "${_SCRIPTBASENAME}")"

  if [[ "${LIST}" = "" ]]; then

    { yellow "nothing to link in directory '${_CWD}'\n"; } 2>&3

    exit 0
  fi

  echo;

  echo -e "${LIST}" | while read FILE ; do

    link "${FILE}"

    _RET="${?}"

    if [ "${_RET}" != "0" ]; then

      CODE="${_RET}";
    fi

  done

  echo;

  exit ${CODE}
fi

if [ "${1}" = "unlink" ]; then

  function unlinkfile {
    (
      cd "${_CWD}"

      echo -n "${1} "

      INODES="$(ls -l "${1}" | awk '{ print $2 }')"

      if [ "${INODES}" = "1" ]; then

        { green "${INODES} inodes - already unlinked\n"; } 2>&3
      else

        TARGET="$(node -e "var p=require('path');process.stdout.write(p.resolve(\"${_DIR}\", \"${1}\"))")"

        if [ -f "${TARGET}" ]; then

          { yellow "unlinking ${TARGET}\n"; } 2>&3

          unlink "${1}"

          _RET="${?}"

          if [ "${_RET}" != "0" ]; then

            CODE="${_RET}";
          fi

          cp "${TARGET}" "${1}"
        else

          { red " target file '${TARGET} doesn't exist\n"; } 2>&3

          return 1;
        fi
      fi
    )
  }

  cd "${_CWD}"

  echo;

  LIST="$(find . -type f | grep -v "${_SCRIPTBASENAME}")"

  echo -e "${LIST}" | while read FILE ; do

    unlinkfile "${FILE}"

    _RET="${?}"

    if [ "${_RET}" != "0" ]; then

      CODE="${_RET}";
    fi

  done

  echo;

  exit ${CODE}
fi

if [ "${1}" = "source" ]; then

  function sourceFile {
    (
      cd "${_DIR}"

      echo -n "${1} "

      mkdir -p "$(dirname "${1}")"

      { yellow "sourcing ${1}\n"; } 2>&3

      ln "${_CWD}/${1}" "${_DIR}/${1}"
    )
  }

  cd "${_CWD}"

  LIST="$(find . -type f | grep -v "${_SCRIPTBASENAME}")"

  NEWLIST="";

  cd "${_DIR}"

  echo -e "${LIST}" | while read FILE ; do

    if [ ! -e "${_DIR}/${FILE}" ]; then

      if [ "${NEWLIST}" != "" ]; then

        NEWLIST="${NEWLIST}\n";
      fi

      NEWLIST="${NEWLIST}${FILE}";
    fi

  done

  MAX="1"

  COUNT="$(echo "${NEWLIST}" | wc -l)"

  COUNT="$(trim "${COUNT}")"

  if [ "${COUNT}" -gt "${MAX}" ]; then

    echo;

    echo "${NEWLIST}"

    echo;

    { red "${COUNT} files found (more than ${MAX}), are you sure you want to include them to other libraries them? (y|n)\n"; } 2>&3

    if [ "${_BINARY}" = "/bin/zsh" ]; then

      read -sk
    else

      read -n 1
    fi

    echo;

    if ! [[ ${REPLY} =~ ^[Yy]$ ]]; then

      { green "script stopped\n"; } 2>&3

      exit 1
    fi
  fi;

  if [ "${NEWLIST}" = "" ]; then

      { yellow "no new libraries found to source\n"; } 2>&3
  else

    echo -e "${NEWLIST}" | while read FILE ; do

      sourceFile "${FILE}"

      _RET="${?}"

      if [ "${_RET}" != "0" ]; then

        CODE="${_RET}";
      fi

    done

    echo;
  fi

  exit ${CODE}
fi

{ red "command '${1} is not supported'\n"; } 2>&3

exit 1;






