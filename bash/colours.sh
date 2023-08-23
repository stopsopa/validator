
exec 3<> /dev/null
function green {
    printf "\e[32m${1}\e[0m\n"
}

function red {
    printf "\e[31m${1}\e[0m\n"
}

function yellow {
    printf "\e[33m${1}\e[0m\n"
}

function magenta {
    printf "\e[35m${1}\e[0m\n"
}

# source "${DIR}/../colours.sh"

# from now on:
# { red "\n\n   hellow world\n\n"; } 2>&3

#{ yellow "$(cat <<END
#
#multi
#
#line
#
#
#END
#)"; } 2>&3

#{ red "
#
#multi
#
#line
#
#
#"
#} 2>&3


