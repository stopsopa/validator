
exec 3<> /dev/null
function red {
    printf "\e[91m$1\e[0m\n"
}
function green {
    printf "\e[32m$1\e[0m\n"
}

_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"

_ENV="${_DIR}/.env"

if [ ! -f "${_ENV}" ]; then

    echo "${0} error: ${_ENV} is not a file"

    exit 1
fi

eval "$(/bin/bash bash/exportsource.sh "${_ENV}")"

if [ "${NODE_API_HOST}" = "" ]; then

  echo "${0} error: NODE_API_HOST is not defined"

  exit 1;
fi

if [ "${NODE_API_PORT}" = "" ]; then

  echo "${0} error: NODE_API_PORT is not defined"

  exit 1;
fi

if [ "$1" = "--help" ]; then

cat << EOF

    /bin/bash $0 --help
    /bin/bash $0 --watch                        ## this will run only changed test
    /bin/bash $0 --watchAll                     ## this will run all test on every change
    /bin/bash $0 [--watch|--watchAll] tests/... ## will run one test file or dir with tests 
    /bin/bash $0 -t 'filter test'               ## this will run only tests matching the provided string

EOF

    exit 0
fi

set -e

sleep 2

echo ""

set -e
# set -x

# --bail \
# --silent=false \
# --verbose false \

TEST="$(cat <<END
node node_modules/.bin/jest \
$@ \
--roots tests \
--verbose \
--runInBand \
--modulePathIgnorePatterns \
    tests/examples \
    karma_build
END
)";

{ green "\n\n    executing tests:\n        $TEST\n\n"; } 2>&3

$TEST

STATUS=$?

echo ""
echo ""
if [ "$STATUS" = "0" ]; then

    { green "\n    Tests passed\n"; } 2>&3
    echo ""
    echo ""
else

    { red "\n    Tests crashed\n"; } 2>&3
    echo ""
    echo ""

    exit $STATUS
fi
