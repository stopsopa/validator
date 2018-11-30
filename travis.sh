
set -e
set -x

function red {
    printf "\e[91m$1\e[0m\n"
}
function green {
    printf "\e[32m$1\e[0m\n"
}

if [ "$MODE" = "karma" ]; then

    if [ "$BROWSER" != "Safari" ]; then

        export DISPLAY=:99.0

        sh -e /etc/init.d/xvfb start
    fi

    make ck

    yarn add karma

EXECUTE="$(cat <<END
make karma
END
)";
fi

if [ "$MODE" = "jest" ]; then

    yarn add "coveralls"@"^3.0.2" "jest"@"^23.6.0"

    EXECUTE="/bin/bash test.sh"
fi

if [ "$MODE" = "" ]; then

    red "first setup MODE env variable"

    exit 10
fi

green "\n\n    executing tests:\n        $EXECUTE\n\n"

$EXECUTE

STATUS=$?

if [ "$MODE" = "jest" ]; then

    cat ./coverage/lcov.info | node node_modules/coveralls/bin/coveralls.js
fi

exit $?
