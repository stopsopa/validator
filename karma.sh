

if [ -f package_karma.json ]; then

    echo -e "Run\n    make ck"

    exit 1;
fi

export KARMAFILTER=''

if [ "$1" != "" ]; then

    export KARMAFILTER="$1"
fi

set -e
set -x

node node_modules/.bin/webpack --config webpack-KARMA.config.js

node node_modules/.bin/karma start --log-level debug --single-run