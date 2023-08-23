
THISFILE=${BASH_SOURCE[0]}
DIR="$( cd "$( dirname "${THISFILE}" )" && pwd -P )"

function _datetime {
    date "+%Y-%m-%d %H:%M:%S"
}

source "${DIR}/../colours.sh";

while true
do

    DIFFSTATUS="$(git status -s)"

    if [ "${DIFFSTATUS}" = "" ] ; then

        break;
    fi

    { red "[error] first commit changes"; } 2>&3

    { yellow "current git status is:\n\n${DIFFSTATUS}\n\n"; } 2>&3

    { yellow "please commit changes and press ENTER, or just stop entire script by Ctrl+C"; } 2>&3

    read trash
done