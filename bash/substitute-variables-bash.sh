#!/bin/bash

if [ "${1}" = "" ] || [ "${1}" = "--help" ]; then

cat <<EEE

cat <<EOF > abc.sh

echo start

ABC="abc def" # @substitute

echo 'something else'

BCD="bcd def" # @substitute

echo end "BCD=\\\${BCD}"

VAR="var default" # @xxx

EOF

/bin/bash "${0}" abc.sh -- ABC "[]-.*" BCD "-" VAR "changed"

# to change delimiter
/bin/bash "${0}" abc.sh --commented "# @xxx" -- ABC "[]-.mmm*" BCD "-mmmm" VAR "changed"

--commented   tells to change only lines with this comment
  default is "# @substitute"

EEE

    set -e; _exit 1> /dev/null 2> /dev/null
fi

#T="qwe|rt{yu}io(pa)sd[fg]hj^kl\$zx+cv*bn?mq.we/rtyuiopasdfghjklzxcvbnm"
#echo "${T}"
#
## escaping [
## https://stackoverflow.com/a/27973573
#echo "${T}" | sed -E "s/([][|\\{}()^$\\+*\\?\\.\/])/\\\\\1/g"

function preg_quote {

  echo "${1}" | sed -E "s/([][|\\{}()^$\\+*\\?\\.\/])/\\\\\1/g"
}

function quote {
  echo "${1}" | sed -E 's/\"/\\"/g'
}

function dquote {
  echo "${1}" | sed -E 's/\"/\\\\"/g' | sed -E 's/\//\\\//g'    
  # second sed here is to prevent error
  #                                                                                                                                               v -- right here, one more \ is needed to make it work properly on mac and linux
  # sed  -i '' "-E" "s/^GITSTORAGE_CORE_REPOSITORY=".*"[[:space:]]*;?[[:space:]]*# @substitute/GITSTORAGE_CORE_REPOSITORY="gitgithub\.com:stopsopa\/gitstorage\.git"; # @substitute/g" "gitstorage-core.sh"
  # sed: 1: "s/^GITSTORAGE_CORE_REPO ...": bad flag in substitute command: 't'   
  #
  # where in .env you have
  # GITSTORAGE_CORE_REPOSITORY="gitgithub.com:stopsopa/gitstorage.git"
}


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

_TEMPLATE="# @substitute";

PARAMS=""
while (( "${#}" )); do
  case "${1}" in
    -c|--commented)
      if [ "${2}" = "" ]; then                            # PUT THIS CHECKING ALWAYS HERE IF YOU WAITING FOR VALUE
        { red "${0} error: --remote value can't be empty"; } 2>&3
        set -e; _exit 1> /dev/null 2> /dev/null                                          # optional
      fi                                  # optional
      _TEMPLATE="${2}";
      shift 2;
      ;;
    --) # end argument parsing
      shift;
      while (( "${#}" )); do          # optional
        if [ "${1}" = "&&" ]; then
          PARAMS="${PARAMS} \&\&"
        else
          if [ "${PARAMS}" = "" ]; then
            PARAMS="\"$(quote "${1}")\""
          else
            PARAMS="${PARAMS} \"$(quote "${1}")\""
          fi
        fi
        shift;                      # optional
      done                          # optional if you need to pass: /bin/bash ${0} -f -c -- -f "multi string arg"
      break;
      ;;
    -*|--*=) # unsupported flags
      { red "${0} error: Unsupported flag ${1}"; } 2>&3
      set -e; _exit 1> /dev/null 2> /dev/null
      ;;
    *) # preserve positional arguments
      if [ "${1}" = "&&" ]; then
          PARAMS="${PARAMS} \&\&"
      else
        if [ "${PARAMS}" = "" ]; then
            PARAMS="\"$(quote "${1}")\""
        else
          PARAMS="${PARAMS} \"$(quote "${1}")\""
        fi
      fi
      shift;
      ;;
  esac
done

eval set -- "${PARAMS}"

FILE="${1}"

shift;

if [ ! -f "${FILE}" ]; then

    { red "${0} error: file '${FILE}' doesn't exist\n"; } 2>&3

    set -e; _exit 1> /dev/null 2> /dev/null
fi

while (( "${#}" )); do

  if [ "${1}" = "" ]; then

    { red "${0} error: name from pair cannot be empty string\n"; } 2>&3

    set -e; _exit 1> /dev/null 2> /dev/null
  fi

  _ENVVAR="${1}";
  _VALUE="${2}";

  shift;
  shift;

# cat <<EOF


# sed -i "" -E "s/^${_ENVVAR}=\".*\"[[:space:]]*;?[[:space:]]*$(preg_quote "${_TEMPLATE}")/${_ENVVAR}=\"$(dquote "$(preg_quote "${_VALUE}")")\"; $(preg_quote "${_TEMPLATE}")/g" "${FILE}"


# EOF

/bin/bash bash/sed.sh -i -E "s/^${_ENVVAR}=\".*\"[[:space:]]*;?[[:space:]]*$(preg_quote "${_TEMPLATE}")/${_ENVVAR}=\"$(dquote "$(preg_quote "${_VALUE}")")\"; $(preg_quote "${_TEMPLATE}")/g" "${FILE}"

#ABC 'xxx' BCD eee
#  sed -i -E "s/^ABC=\"\"[[:space:]]*# @substitute/ABC=\"xxx\" # @substitute/g" "abc.sh"
#  sed -i -E "s/^ABC=\"[^\"]*\"[[:space:]]*# @substitute/ABC=\"xxx\" # @substitute/g" "abc.sh"

done
