
#
# This script is to cover case when you have to use in node script two libraries
# "dotenv" to load environment variables from .env and then
# "config" which relays on those to properly read config
# together
# The occurs when you use ESM module system in node by executing .mjs file
# or by turning on "type": "module", flag in package.json (more: https://nodejs.org/api/esm.html#enabling)
# from that point even when you try to load both:
#
# import * as dotenv from "dotenv";
#
# dotenv.config({
#   path: env,
# });
#
# import config from "config";
#
# config will be executed first anyway
# therefor one of solutions might be to load .env environment vars first and then executing
# desired script
#
# then now you can just run:
# /bin/bash esm.sh your_script.mjs
#

# keep in mind that this path will be resolved from CWD - Current working directory
ENV=".env"

if [ ! -f "${ENV}" ]; then

  echo "${0} error: '${NEV}' file doesn't exist"

  exit 1
fi

# will import env vars from file
source "${ENV}"

# will export all
export $(cut -d= -f1 "${ENV}" | grep -v -E "^#" | tr "\n" " ")

function quote {
  echo "$1" | sed -E 's/\"/\\"/g'
}

# preparing arguments passed to this script for evaluation
_EVAL=""
while (( "$#" )); do
    if [ "$1" = "&&" ]; then
        _EVAL="$_EVAL &&"
    else
      if [ "$PARAMS" = "" ]; then
          _EVAL="\"$(quote "$1")\""
      else
          _EVAL="$_EVAL \"$(quote "$1")\""
      fi
    fi
    shift;
done

set -e

eval "node --experimental-specifier-resolution=node $_EVAL"

