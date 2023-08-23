
# https://unix.stackexchange.com/a/79065

# script will properly export variables defined in .env file, where normally they are not prefixed with "export" keyword
#
# USAGE:

# override mode - false (default)
# eval "$(/bin/bash bash/exportsource.sh .env.test)"
#
# override mode - true
# eval "$(/bin/bash bash/exportsource.sh .env.test true)"

if [ ! -f "${1}" ]; then

  echo "${0} error: file '${1}' doesn't exist"

  exit 1
fi

if [ "${2}" = "" ]; then

#https://stackoverflow.com/a/8574392
containsElement () {
    local e
    for e in "${@:2}"; do [[ "${e}" == "${1}" ]] && return 0; done
    return 1
}

#$ array=("something to search for" "a string" "test2000")
#$ containsElement "a string" "${array[@]}"
#$ echo ${?}
#0
#$ containsElement "blaha" "${array[@]}"
#$ echo ${?}
#1

ENV_VAR_LIST_EXISTING=();

while read -r ___ENV
do
  if [ "${___ENV}" != "" ] && [ "${!___ENV}" != "" ]; then

    ENV_VAR_LIST_EXISTING+=("${___ENV}")
  fi
done <<< "$(printenv | awk 'BEGIN {FS="="}{print $1}')"

#echo "existing >>${ENV_VAR_LIST_EXISTING[@]}<<"

{
source "${1}"

cat <<EOF

# echo "override mode: false"
# eval "\$(/bin/bash "${0}" "${1}")"

EOF

while read -r ___ENV
do
  if [ "${___ENV}" != "" ] && [ "${!___ENV}" != "" ]; then

    containsElement "${___ENV}" "${ENV_VAR_LIST_EXISTING[@]}"

    if [ "${?}" != "0" ]; then

      echo "export ${___ENV}=\"${!___ENV}\""
    fi
  fi

done <<< "$(cut -d= -f1 "${1}" | grep -v -E "^#")"



}


else


cat <<EOF

# echo "override mode: true"
# eval "\$(/bin/bash "${0}" "${1}" true)"

source "${1}"

export $(cut -d= -f1 "${1}" | grep -v -E "^#" | tr "\n" " ")

EOF


fi

# materials to improve: https://gist.github.com/mihow/9c7f559807069a03e302605691f85572
