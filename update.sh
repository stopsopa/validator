
#!/bin/bash

set -e

set -x

ORIGIN="origin"
LOCALBRANCH="master"
REMOTEBRANCH="master"

trim() {
    local var="$*"
    # remove leading whitespace characters
    var="${var#"${var%%[![:space:]]*}"}"
    # remove trailing whitespace characters
    var="${var%"${var##*[![:space:]]}"}"
    echo -n "$var"
}

function red {
    printf "\e[31m$1\e[0m\n"
}

function green {
    printf "\e[32m$1\e[0m\n"
}

if [ "$(git rev-parse --abbrev-ref HEAD)" != $LOCALBRANCH ]; then

    red "switch first branch to <$LOCALBRANCH>"

    exit 1;
fi

green "\ncurrent branch: $LOCALBRANCH";

DIFF="$(git diff --numstat)"

DIFF="$(trim "$DIFF")"

if [ "$DIFF" != "" ]; then

    red "\n\n    Error: First commit changes ...\n\n";

    exit 2;
fi

DIFF="$(git diff --numstat $LOCALBRANCH $ORIGIN/$REMOTEBRANCH)"

DIFF="$(trim "$DIFF")"

if [ "$DIFF" != "" ] || [ "$1" = "force" ]; then

    git push $ORIGIN $REMOTEBRANCH --tags

    if [ "$?" != "0" ]; then

        red "\n\nCan't git push - stop bumping version\n"

        exit 3;
    fi

    npm version patch

                            node update-badge.js
                            git add README.md
                            git commit --amend --no-edit

    git push $ORIGIN $REMOTEBRANCH

    if [ "$?" = "0" ]; then

        npm publish

        if [ "$?" != "0" ]; then

            red "\n\nCan't npm publish\n    try to run 'npm login'\n"

            exit 4;
        fi

        git push --tags --force

        #git push origin master --tags

    else

        red "\n\nCan't git push\n"

        exit 5
    fi

else

    red "\n\n    Nothing new to publish, \n        run 'make update-force' if you're sure that there is still that should be published\n\n";
fi
