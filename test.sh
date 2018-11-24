

function red {
    printf "\e[91m$1\e[0m\n"
}
function green {
    printf "\e[32m$1\e[0m\n"
}

if [ "$1" = "--help" ]; then

cat << EOF

    /bin/bash $0 --help
    /bin/bash $0 --watchAll

EOF

    exit 0
fi

echo "lets's list";
ls -la
echo "lets's list node_modules";
ls -la node_modules/.bin/

JEST=""

if [ -f node_modules/.bin/jest ]; then  # exist

    green "node_modules/.bin/jest - exists"

    JEST="node node_modules/.bin/jest"
else

    green "node_modules/.bin/jest - doesn't exist"
fi

if [ "$JEST" = "" ]; then

    green "local jest - not found"

    jest -v > /dev/null

    STAT="$?"

    green "(jest -v) status: $STAT";

    if [ "$STAT" = "0" ]; then

        green "global jest - found"

        JEST="jest"
    else

        red "\n    Can't detect jest, install globally: \n   npm install jest -g\n\n";

        exit 1;
    fi
else

    green "local jest - found"
fi


TEST="$(cat <<END
$JEST \
$@ \
--bail \
--verbose \
--runInBand \
--modulePathIgnorePatterns test/examples test/minefield test/project test/puppeteer
END
)";


green "\n\n    executing tests:\n        $TEST\n\n"

$TEST

STATUS=$?

if [ "$STATUS" = "0" ]; then

    green "\n    Tests passed\n";
else

    red "\n    Tests crashed\n";

    exit $STATUS
fi
