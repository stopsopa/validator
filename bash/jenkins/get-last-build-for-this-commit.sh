
# /bin/bash bash/jenkins/get-last-build-for-this-commit.sh --save --limit 6 --hash 5fd765f --tag lh:1.0.0-dedv
# /bin/bash bash/jenkins/get-last-build-for-this-commit.sh --save --limit 6 --hash 5fd765f --tag lh:1.0.0-dedv --limit 10
# /bin/bash bash/jenkins/get-last-build-for-this-commit.sh --find --hash 5fd765

_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"

FILE="$_DIR/get-last-build-for-this-commit.cache";

_MODE=""

_HASH=""

_TAG=""

_LIMIT="20"

PARAMS=""
while (( "$#" )); do
  case "$1" in
    --save)
      _MODE="save"
      shift;
      ;;
    --find)
      _MODE="find"
      shift;
      ;;
    --hash)
      if [ "$2" = "" ]; then
        echo "$0 error: --hash value can't be empty" >&2
        exit 1;
      fi
      _HASH="$2"
      shift 2;
      ;;
    --limit)
      if [ "$2" = "" ]; then
        echo "$0 error: --limit value can't be empty" >&2
        exit 1;
      fi
      TEST="^[0-9]+$"
      if ! [[ $2 =~ $TEST ]]; then
          echo "$0 error: limit '$2' doesn't match $TEST"
          exit 1;
      fi
      if [ "$2" -lt "5" ]; then
          echo "$0 error: limit '$2' smaller than 5"
          exit 1;
      fi
      _LIMIT="$2"
      shift 2;
      ;;
    --tag)
      if [ "$2" = "" ]; then
        echo "$0 error: --tag value can't be empty" >&2
        exit 1;
      fi
      _TAG="$2"
      shift 2;
      ;;
    -*|--*=) # unsupported flags
      echo "$0 error: Unsupported flag $1" >&2
      exit 1;
      ;;
    *) # preserve positional arguments
      if [ "$PARAMS" = "" ]; then
          PARAMS="\"$1\""
      else
          PARAMS="$PARAMS \"$1\""
      fi
      shift;
      ;;
  esac
done

if [ "$_HASH" = "" ]; then

    echo -e "\n\n$0 error: parameter _HASH is not defined - spedify it in --hash parameter\n\n";

    exit 1;
fi

if [ "$_MODE" = "" ]; then

    echo -e "\n\n$0 error: parameter _MODE is not defined - spedify it in using --save or --find parameter\n\n";

    exit 1;
fi

if [ "$_MODE" = "save" ]; then

    if [ "$_TAG" = "" ]; then

        echo -e "\n\n$0 error: parameter _TAG is not defined - spedify it in using --tag parameter\n\n";

        exit 1;
    fi
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

FOUND="$(cat "$FILE" | grep "$_HASH ")"

if [ "$EXIST" = "0" ]; then

    unlink "$FILE";

    if [ -f "$FILE" ]; then

        echo "$0 error: file '$FILE' can't be deleted"

        exit 1;
    fi
fi

if [ "$_MODE" = "save" ]; then

    set -e

    if ! [ -f "$FILE" ]; then

        touch "$FILE";
    fi

    echo "$(cat "$FILE" | grep -v "$_HASH " | grep -Ev "^$")" > "$FILE"

    echo "$_HASH $_TAG" >> "$FILE";

    echo "$(cat "$FILE" | tail -n "$_LIMIT")" > "$FILE"

    set +e

    echo 'saved';

    exit 0;
fi

if [ "$_MODE" = "find" ]; then

  if [ "$FOUND" != "" ]; then

    printf "$FOUND" | sed -nE "s/^[a-fA-F0-9]+ (.*$)/\1/p" | tr -d '\n'
  fi
fi