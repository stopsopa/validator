
set -e

# https://majgis.github.io/2017/09/13/Create-Authorization-Basic-Header/
# echo -n 'admin:password' | base64
# YWRtaW46cGFzc3dvcmQ=

if [ "${1}" = "--help" ]; then

cat << EOF

/bin/bash ${0} --user admin --pass password

EOF

  exit 1;
fi

USER=""
PASSWORD=""

if [ "${1}" = "--user" ]; then

  USER="${2}"

  shift;
  shift;
fi

if [ "${1}" = "--pass" ]; then

  PASSWORD="${2}"

  shift;
  shift;
fi

if [ "${1}" = "--user" ]; then

  USER="${2}"

  shift;
  shift;
fi

if [ "${USER}" = "" ]; then

    echo "--user param is not given"

    exit 1
fi

if [ "${PASSWORD}" = "" ]; then

    echo "--pass param is not given"

    exit 1
fi

echo -n "${USER:}${PASSWORD}" | base64
