
# https://stackoverflow.com/a/8574392
inArray () {
    local e
    for e in "${@:2}"; do [[ "${e}" == "${1}" ]] && return 0; done
    return 1;
}

#DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"
#
#source "${DIR}/bash/inarray.sh";
#
#arr=( "${@}" )
#
#inArray "--test" "${arr[@]}"
#if [ "${?}" = "0" ]; then
#  echo 'if';
#else
#  echo 'else';
#fi
