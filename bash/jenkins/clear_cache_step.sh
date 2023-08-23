#!/bin/bash


# DEPRECATED: use fs/watch_files_in_dir.sh instead
# DEPRECATED: use fs/watch_files_in_dir.sh instead
# DEPRECATED: use fs/watch_files_in_dir.sh instead
# DEPRECATED: use fs/watch_files_in_dir.sh instead
# DEPRECATED: use fs/watch_files_in_dir.sh instead
# DEPRECATED: use fs/watch_files_in_dir.sh instead
# DEPRECATED: use fs/watch_files_in_dir.sh instead
# DEPRECATED: use fs/watch_files_in_dir.sh instead
# DEPRECATED: use fs/watch_files_in_dir.sh instead
# DEPRECATED: use fs/watch_files_in_dir.sh instead


# the idea with this script is to first copy it SOMEWHERE to the target machine.
# then create run.sh script with desired procedure to run
# then you need to run it as a root - wait 12 seconds
# then take generated crontab line and register as a root in /etc/crontab
# then from other user just go and run this script and cronjob will detect it and do it's stuff and then carry on with
# periodic checks

# INFO: script i capable of generating cronjob line,
# just run it with no params and wait
#
# jenkins mode:
#   /bin/bash $0 [optional path to file]
#
# cron mode:
#   /bin/bash $0 cron [optional path to file]
#     * * * * * root  for i in {1..6}; do /bin/bash ".../ttt.sh" cron & sleep 10; done
#
# modes called internally:
#   /bin/bash $0 harakiri $pid $sleepsec $FILE
#     called internally in background

#   /bin/bash $0 harakiri $pid $sleepsec justvalidateparams
#     called internally in background just to validate before run


TIMEOUTSEC="12"
WAITAFTERCLEAN="7"

set -e

if [ "$1" = "harakiri" ]; then

    TEST="^[0-9]+$"

    if ! [[ "$2" =~ $TEST ]]; then

        echo "pid param \$2($2) don't match '$TEST'";

        exit 1;
    fi

    if [ "$2" -lt 1 ]; then

        echo "pid param \$2($2) is smaller than '1'";

        exit 1
    fi

    if ! [[ "$3" =~ $TEST ]]; then

        echo "sleepsec param \$3($3) don't match '$TEST'";

        exit 1;
    fi

    MAX=5

    if [ "$3" -lt "$MAX" ]; then

        echo "sleepsec param \$3($3) is smaller than '$MAX'";

        exit 1
    fi

    if [ "$4" = "justvalidateparams" ]; then

      exit 0;
    fi

    sleep $(awk "BEGIN {print $3+0.5; exit}");

    if [ -e "$4" ]; then

        kill -s SIGUSR1 $2 1>> /dev/null 2>> /dev/null
    fi

    exit 0; # exit implicitly just in case
fi

_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"

FILE="$_DIR/lock.lock";

if [ ! -f "$_DIR/run.sh" ]; then

  echo "$_DIR/run.sh - doesn't exist";

  exit 1
fi

DEF="$FILE"

if [ "$1" = "cron" ]; then

    if [ "$2" != "" ]; then

        FILE="$2"
    fi

    if [ -e "$FILE" ]; then

        unlink "$FILE";

        if [ -e "$FILE" ]; then

            echo "file $FILE still exist";

            exit 102;
        fi

        echo -e "\n\n\n$(date +%Y-%m-%d_%H-%M-%S)\n";

        set -x

        /bin/bash "$_DIR/run.sh"

        exit 101;
    fi

    exit 0;
fi

if [ "$1" != "" ]; then

    FILE="$1"
fi

if [ -e "$FILE" ]; then

    echo "file $FILE already exist, exit code 101"

    exit 101;
fi

/bin/bash $0 harakiri $$ $TIMEOUTSEC justvalidateparams

/bin/bash $0 harakiri $$ $TIMEOUTSEC "$FILE" &

function cleanup {

    if [ "$1" = "SIGUSR1" ]; then

        echo "timeout: $TIMEOUTSEC, trapped SIGUSR1: exit code 100";

        echo -e "\nlooks like cronjob is not registered:\n";

        ADD="";
        if [ "$FILE" != "$DEF" ]; then

            ADD=" \"$FILE\""
        fi

        FILE="$(basename "$0")"

        LOG="clear_cache_step.log"

        # * * * * * root  for i in {1..6}; do /bin/bash "/home/jenkins/clear_cache_step.sh" cron 1>> /home/jenkins/clear_cache_step.log 2>> /home/jenkins/clear_cache_step.log & sleep 10; done
        echo -e "\n    * * * * * root  for i in {1..6}; do cd \"$_DIR\"; /bin/bash \"$0\" cron$ADD 1>> \"$LOG\" 2>> \"$LOG\" & sleep 10; done\n\n";

        exit 100;
    fi
}

trap "cleanup SIGUSR1" SIGUSR1

echo '.' > "$FILE"

C="1";

while true; do

    if [ -e "$FILE" ]; then

        sleep 1

        echo "$C/${TIMEOUTSEC}sec: file $FILE still exist"

        C=$((C+1))
    else

        echo "file $FILE deleted, wait another $WAITAFTERCLEAN sec, WAITAFTERCLEAN: $WAITAFTERCLEAN"

        sleep $WAITAFTERCLEAN;

        LOG="$_DIR/clear_cache_step.log"

        echo ""
        echo "log file: $LOG"
        echo "current time: $(date +%Y-%m-%d_%H-%M-%S)"
        echo "------------------ vvv";
        echo "..."
        LOG="$(cat $LOG || true)"
        echo "$LOG" | tail -n 10
        echo "------------------ ^^^";

        break;
    fi
done

## test how to handle sig https://stackoverflow.com/a/9256709
##!/bin/bash
#trap_with_arg() {
#    func="$1" ; shift
#    for sig ; do
#        echo "trap for: $sig, you can try: kill -s $sig $$"
#        trap "$func $sig" "$sig"
#    done
#
#    trap "$func SIGUSR1" SIGUSR1
#    echo "trap for: SIGUSR1, you can try: kill -s SIGUSR1 $$"
#    trap "$func SIGUSR2" SIGUSR2
#    echo "trap for: SIGUSR2, you can try: kill -s SIGUSR2 $$"
#    trap "$func SIGUSR2" SIGUSR2
#    echo "trap for: SIGUSR2, you can try: kill -s SIGUSR2 $$"
#}
#
#func_trap() {
#    echo "Trapped: $1"
#}
#
#trap_with_arg func_trap INT TERM EXIT
#
#echo "Send signals to PID $$ and type [enter] when done."
#read # Wait so the script doesn't exit.