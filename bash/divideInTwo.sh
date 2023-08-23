
# idea from: https://unix.stackexchange.com/a/522054
# usage
#  divideInTwo "abcde" " ---- "
function divideInTwo {

  DELIMITER="${2}"

  if [ "${DELIMITER}" = "" ]; then
    DELIMITER=" "
  fi

  printf "${1:0:${#1}/2}${DELIMITER}${1:${#1}/2}"
}

#function divideInTwo {
#
#  DELIMITER="\${2}"
#
#  if [ "\${DELIMITER}" = "" ]; then
#    DELIMITER="█▓▒░■░▒▓█"
#  fi
#
#  printf "░▒▓█\${1:0:\${#1}/2}\${DELIMITER}\${1:\${#1}/2}█▓▒░"
#}