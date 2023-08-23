
# WARNING: works only for bash
#
# purpose of this script is run some node.js command but in presence of INSPECT_NODE_PORT=9229 env var
# it should inject it to node itself as an argument --inspect=${INSPECT_NODE_PORT}"
#
# additionally it should also export all variables from .env - if it's present
#
# /bin/sh ${0} server.js
#
#     it will launch
#        node server.js
#     in absence of INSPECT_NODE_PORT env var
#
#     but will launch
#        node --inspect=9000 server.js
#     when INSPECT_NODE_PORT=9000
#
# where ${0} is name of THIS script filename (that's standard in bash and other linux shells)
#

# testing:
if [ "${1}" = "selftest" ]; then

cat <<EOF

# to run test execute

# eval "\$(/bin/bash "${0}" selftest)"

# docker run -it -v "\$(pwd):/code" -w "/code" -e "__BASH_SELFTEST=true" frapsoft/zsh /bin/zsh ${0} testscript.js a "b c" d
# docker run -it --rm -v "\$(pwd):/code" -w "/code" -e "__BASH_SELFTEST=true" alpine:3.14.2 /bin/sh ${0} testscript.js a "b c" d
# it will not work with zsh or sh

docker run -it --rm -v "\$(pwd):/code" -w "/code" -e "__BASH_SELFTEST=true" bash:3.2.57 /usr/local/bin/bash ${0} testscript.js a "b c" d
docker run -it --rm -v "\$(pwd):/code" -w "/code" -e "__BASH_SELFTEST=true" bash:4.4.23 /usr/local/bin/bash ${0} testscript.js a "b c" d
docker run -it --rm --entrypoint="" -v "\$(pwd):/code" -w "/code" -e "__BASH_SELFTEST=true" bash:5.1.8 /usr/local/bin/bash ${0} testscript.js a "b c" d

EOF

  exit 0;
fi

# attempts to fix environment, for some weird reasons some bash docker images dont have /bin/bash but only /usr/local/bin/bash ¯\_(ツ)_/¯
if [ ! -f /bin/bash ]; then
  if [ -f /usr/local/bin/bash ]; then
    ln -s /usr/local/bin/bash /bin/bash
  fi
fi

# will work only with bash - will not work yet with zsh and sh :( so let's detect early
if [ ! -f /bin/bash ]; then

  echo "${0} error: /bin/bash is required";

  exit 1
fi

if [ -f .env ]; then

  if [ -f helpers/bash/exportsource.sh ]; then

    echo "exporting .env";

    eval "$(/bin/bash helpers/bash/exportsource.sh .env)"
  else

    echo ".env is present but can't be loaded because helpers/bash/exportsource.sh doesn't exist"
  fi
fi

function quote {
  echo "${1}" | sed -E 's/\"/\\"/g'
}

_EVAL=""
while [ "${#}" != "0" ]; do # works also in zsh in comparison to >while (( "${#}" )); do< which is not working
  if [ "${1}" = "&&" ]; then
    _EVAL="${_EVAL} &&"
  else
    if [ "${_EVAL}" = "" ]; then
      _EVAL="\"$(quote "${1}")\""
    else
      _EVAL="${_EVAL} \"$(quote "${1}")\""
    fi
  fi
  shift;
done

# custom logic justifying this script vvv

  if [ "${INSPECT_NODE_PORT}" = "" ]; then

    INSPECT_NODE_PORT=" "
  else
    INSPECT_NODE_PORT=" --inspect=${INSPECT_NODE_PORT} "
  fi

# custom logic justifying this script ^^^

echo "${0} executing: >>node${INSPECT_NODE_PORT}${_EVAL}<<"

if [ "${__BASH_SELFTEST}" = "" ]; then # don't execute, just print in selftest mode

  set -e

  eval "node${INSPECT_NODE_PORT}${_EVAL}"
fi
