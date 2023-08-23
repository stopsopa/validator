
# /bin/bash $0 14885017ca4922ab2f76e9a846f7a8c7db6646bf
# /bin/bash $0 14885017ca4922ab2f76e9a846f7a8c7db6646bf 20
# second argument is to tell how many last checksums keep in file (default 20)

_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"

FILE="$_DIR/checksum-built-already.cache";

if [ "$1" = "" ]; then

    echo "$0 error: provide checksum"

    exit 1;
fi

LIMIT="20"

if [ "$2" != "" ]; then

    TEST="^[0-9]+$"

    if ! [[ $2 =~ $TEST ]]; then

        echo "$0 error: limit '$2' doesn't match $TEST"

        exit 1;
    fi

    if [ "$2" -lt "5" ]; then

        echo "$0 error: limit '$2' smaller than 5"

        exit 1;
    fi

    LIMIT="$2"
fi

EXIST="0"

if [ -f "$FILE" ]; then

  EXIST="1"
fi

if [ "$EXIST" = "0" ]; then

    touch "$FILE";

    if ! [ -f "$FILE" ]; then

        echo "$0 error: file '$FILE' can't be created"

        exit 1;
    fi
fi

FOUND="$(cat "$FILE" | grep "$1")"

if [ "$EXIST" = "0" ]; then

    unlink "$FILE";

    if [ -f "$FILE" ]; then

        echo "$0 error: file '$FILE' can't be deleted"

        exit 1;
    fi
fi

if [ "$FOUND" = "" ]; then

    set -e

    if ! [ -f "$FILE" ]; then

        touch "$FILE";
    fi

    echo "$(cat "$FILE" | grep -v "$1" | grep -Ev "^$")" > "$FILE"

    echo "$1" >> "$FILE";

    echo "$(cat "$FILE" | tail -n "$LIMIT")" > "$FILE"

    set +e

    echo 'notfound';

    exit 0;
fi

echo 'found';
