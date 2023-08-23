

# simpler, more understandable from api point of view version of swap-files.js
# you just have to call this script providing pairs of files to be swapped then -- and after that command you would like to execute

# /bin/bash bash/swap-files-v2.sh package.json package.dev.json ../directory/.gitignore .npmignore -- ls -la \&\& sleep 10 \&\& echo end
# SWAPQUIET=1 /bin/bash bash/swap-files-v2.sh package.json package.dev.json ../directory/.gitignore .npmignore -- ls -la \&\& sleep 10 \&\& echo end

I="0"
FOUND_HYPHEN_HYPHEN="0"
for x in "$@"
do

  if [ "${x}" = "--" ]; then
    FOUND_HYPHEN_HYPHEN="1"
    break;
  fi

  I=$((I + 1))

  if ! [ -f "${x}" ]; then

  cat <<EEE

  file '${x}' should exist

EEE
    exit 1    
  fi
done

if [ "${I}" = "0" ]; then

  cat <<EEE

  provide at least one pair of files to swap before -- argument

EEE

  exit 1
fi

if [[ $(( I % 2 )) != 0 ]]; then
  cat <<EEE

  you should provide pairs of files to swap, 
  the fact that odd number of arguments was provided before -- argument is wrong

EEE

  exit 1
fi

if [ "${FOUND_HYPHEN_HYPHEN}" = "0" ]; then

  cat <<EEE

  -- argument not found

EEE

  exit 1
fi

if ! [ "${#}" -gt "$((I + 1))" ]; then

  cat <<EEE

  there should be more arguments (the actual command) to execute after -- argument
  but nothing follows --

EEE

  exit 1
fi

SWAP_BACK=();

function cleanup {

if [ "${SWAPQUIET}" != "1" ]; then
cat <<EEE

  $(basename "${0}") swapping files back:

EEE
fi

  BUFF=""
  ONE=""
  for TMP in "${SWAP_BACK[@]}"
  do  
      if [ "${BUFF}" = "" ]; then
        BUFF="${TMP}"
        continue;
      fi

      if [ "${ONE}" = "" ]; then
        ONE="${TMP}"
        continue;
      fi
      
      # echo "BUFF: ${BUFF}"
      # echo "ONE: ${ONE}"
      # echo "TMP: ${TMP}"

      if [ "${SWAPQUIET}" != "1" ]; then
        echo mv "${BUFF}" "${ONE}"
        echo mv "${TMP}" "${BUFF}"
      fi

      mv "${BUFF}" "${ONE}"
      mv "${TMP}" "${BUFF}"

      if [ "${SWAPQUIET}" != "1" ]; then
        echo ""
      fi
      BUFF=""
      ONE=""
  done
}

trap cleanup EXIT;

function quote {
  echo "$1" | sed -E 's/\"/\\"/g'
}

if [ "${SWAPQUIET}" != "1" ]; then
cat <<EEE

  $(basename "${0}") swapping files:

EEE
fi

PARAMS=""
_EVAL=""
BUFF=""
while (( "${#}" )); do
  case "${1}" in
    --) # end argument parsing
      shift;
      while (( "$#" )); do        
        if [ "$1" = "&&" ]; then
          PARAMS="$PARAMS \&\&"
          _EVAL="$_EVAL &&"
        else
          if [ "$PARAMS" = "" ]; then
            PARAMS="\"$(quote "$1")\""
            _EVAL="\"$(quote "$1")\""
          else
            PARAMS="$PARAMS \"$(quote "$1")\""
            _EVAL="$_EVAL \"$(quote "$1")\""
          fi
        fi
        shift;                     
      done                         
      break;
      ;;
    *) # preserve positional argument    
      if [ "${BUFF}" = "" ]; then
        BUFF="${1}"
      else      
        TMP="${1}.bck"
        SWAP_BACK+=("${BUFF}" "${1}" "${TMP}")

        # echo "BUFF: ${BUFF}"
        # echo "ONE: ${1}"
        # echo "TMP: ${TMP}"

        if [ "${SWAPQUIET}" != "1" ]; then
          echo mv "${BUFF}" "${TMP}"
          echo mv "${1}" "${BUFF}"
        fi

        mv "${BUFF}" "${TMP}"
        mv "${1}" "${BUFF}"

        if [ "${SWAPQUIET}" != "1" ]; then
          echo ""
        fi

        BUFF=""
      fi
      shift;
      ;;
  esac
done

if [ "${SWAPQUIET}" != "1" ]; then
cat <<EEE

  $(basename "${0}") executing command: >${_EVAL}<

EEE
fi

set -e

eval "$_EVAL"