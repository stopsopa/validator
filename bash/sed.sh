
# /bin/bash bash/sed.sh -i "s/>><</>>test<</" public/index.html
# use it on mac or on linux instead of
#
# sed -i    "s/>><</>>test<</" public/index.html    # on linux
#
# or
#
# sed -i '' "s/>><</>>test<</" public/index.html    # on mac
#
# more about:
#   https://stackoverflow.com/a/44864004

PARAMS=""
while (( "${#}" )); do
  case "${1}" in
    -i)
      if [ "$(sed --help 2>&1 | grep "i extension" || true)" = "" ]; then
        if [ "${1}" = "&&" ]; then
          PARAMS="${PARAMS} \&\&"
        else
          if [ "${PARAMS}" = "" ]; then
            PARAMS="\"${1}\""
          else
            PARAMS="${PARAMS} \"${1}\""
          fi
        fi
      else
        PARAMS="${PARAMS} -i ''"
      fi
      shift;
      ;;
    *) # preserve positional arguments
      if [ "${1}" = "&&" ]; then
          PARAMS="${PARAMS} \&\&"
      else
        if [ "${PARAMS}" = "" ]; then
            PARAMS="\"${1}\""
        else
          PARAMS="${PARAMS} \"${1}\""
        fi
      fi
      shift;
      ;;
  esac
done

#echo "sed ${PARAMS}"

eval "sed ${PARAMS}"
