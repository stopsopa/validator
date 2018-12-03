
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


    if [ "$1" = "--karma" ]; then

        if [ ! -f package_karma.json ]; then red "package_karma.json does not exist - stop"; exit 1; fi

        if [ ! -f package.json ]; then red "package.json does not exist - stop"; exit 1; fi

        if [ -f package_prod.json ]; then red "package_prod.json does exist - stop"; exit 1; fi

        mv package.json package_prod.json

        if [ ! -f package_prod.json ]; then red "package_prod.json does not exist - stop"; exit 1; fi

        mv package_karma.json package.json

        if [ -f package_karma.json ]; then red "package_karma.json does exist - stop"; exit 1; fi

        if [ ! -f package.json ]; then red "package.json does not exist - stop 2"; exit 1; fi

        green "package.json -> package_prod.json  and  package_karma.json -> package.json [done]"

        exit 0
    fi

    if [ "$1" = "--prod" ]; then

        if [ ! -f package_prod.json ]; then red "package_prod.json does not exist - stop"; exit 1; fi

        if [ ! -f package.json ]; then red "package.json does not exist - stop"; exit 1; fi

        if [ -f package_karma.json ]; then red "package_karma.json does exist - stop"; exit 1; fi

        mv package.json package_karma.json

        if [ ! -f package_karma.json ]; then red "package_karma.json does not exist - stop"; exit 1; fi

        mv package_prod.json package.json

        if [ -f package_prod.json ]; then red "package_prod.json does exist - stop"; exit 1; fi

        if [ ! -f package.json ]; then red "package.json does not exist - stop 2"; exit 1; fi

        green "package.json -> package_karma.json  and  package_prod.json -> package.json [done]"

        exit 0
    fi

    if [ -f package_prod.json ]; then

        red "package_prod.json exist, before update run\n    /bin/bash update.sh --prod"

        exit 1;
    fi



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

    make umd
    cat comment.txt dist/spvalidation.js > dist/test.js
    mv dist/test.js dist/spvalidation.js
    cat comment.txt dist/spvalidation.min.js > dist/test.js
    mv dist/test.js dist/spvalidation.min.js

                            node update-badge.js
                            git add README.md

                            git add dist
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

    red "\n\n    Nothing new to publish, \n        run 'make uf' if you're sure that there is still something that should be published\n\n";
fi
