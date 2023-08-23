
# it would be good to implement also --rm flag, to remove old files matching to pattern
# it would be good to implement also --rm flag, to remove old files matching to pattern
# it would be good to implement also --rm flag, to remove old files matching to pattern
# it would be good to implement also --rm flag, to remove old files matching to pattern
# it would be good to implement also --rm flag, to remove old files matching to pattern
# also it would be good to (relatively) process given paths
# also it would be good to (relatively) process given paths
# also it would be good to (relatively) process given paths
# https://superuser.com/a/392878

# add to main .gitignore
# *-tmp-*

if [ "${1}" = "--help" ]; then

cat << EOF

It's just envsubst but with some additional error handling and
overall this script generates also temporary filename
and new file under this name/location and return name of
this file on the stdout

TMP="\$(/bin/bash bash/envrender.sh .env docker/docker-compose.yml --clear)"
TMP="\$(/bin/bash bash/envrender.sh .env docker/docker-compose.yml -c)"
TMP="\$(/bin/bash bash/envrender.sh .env docker/docker-compose.yml --clear --rmfirst)"
TMP="\$(/bin/bash bash/envrender.sh .env docker/docker-compose.yml --rmfirst)"
TMP="\$(/bin/bash bash/envrender.sh .env docker/docker-compose.yml -r)"
TMP="\$(/bin/bash bash/envrender.sh .env docker/docker-compose.yml --rmfirst --clear)"
TMP="\$(/bin/bash bash/envrender.sh .env docker/docker-compose.yml -r -c)"
TMP="\$(/bin/bash bash/envrender.sh .env docker/docker-compose.yml)"
TMP="\$(/bin/bash bash/envrender.sh .env docker/docker-compose.yml --gen tmp)"
# do something
function cleanup {
    echo "cleanup...";
    unlink "\${TMP}" || true
}
trap cleanup EXIT

EOF

    exit 1
fi

_REMOVEFIRST="0";

_CLEANOLD="";

_GEN="gen-tmp"

PARAMS=""
while (( "${#}" )); do
  case "${1}" in
    -c|--clean|--clear)
      _CLEANOLD=" --clear";
      shift
      ;;
    -r|--rmfirst)
      _REMOVEFIRST="1";
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

source "${_DIR}/colours.sh";

if [ "${#}" -lt "2" ]; then

    { red "There should be at least two arguments given"; } 2>&3

    exit 1
fi

envsubst --help &> /dev/null

if [ "${?}" != "0" ]; then

    # https://stackoverflow.com/a/23622446
    { red "envsubst is not installed run: brew install gettext && brew link --force gettext\nor in linux run apt-get install -y gettext-base"; } 2>&3

    exit 1;
fi

if [ ! -e "${1}" ]; then  # not exist (fnode, directory, socket, etc.)

    # https://stackoverflow.com/a/23622446
    { red "${1} file doesn't exist"; } 2>&3

    exit 1;
fi

if [ ! -e "${2}" ]; then  # not exist (fnode, directory, socket, etc.)

    # https://stackoverflow.com/a/23622446
    { red "${2} file doesn't exist"; } 2>&3

    exit 1;
fi

TMPFILE="$(/bin/bash "${_DIR}/cptmp.sh" "${2}"${_CLEANOLD} --gen "${_GEN}")"

function cleanup {

    unlink "${TMPFILE}" || true
}

trap cleanup EXIT

# https://stackoverflow.com/a/30969768
set -o allexport
source "${1}"
set +o allexport

TMPTMP="$(envsubst < "${2}")"

if [ "${_REMOVEFIRST}" = "1" ]; then

  echo "${TMPTMP}" > "${TMPFILE}"

  # https://superuser.com/a/284270
  TMPTMP="$(awk NR\>1  "${TMPFILE}")"
fi

echo "${TMPTMP}" > "${TMPFILE}"

# clear trap
trap - EXIT

echo "${TMPFILE}"
