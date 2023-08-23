
# Usage:
# content of file a.sh
#
# echo ">>>${@}<<<"
# source bash/args.sh
# echo ">>>${___PARAMS}<<<"
# echo ">>>${___EVAL}<<<"
# echo ">>>${___MULTILINE}<<<"
# echo ">>>${@}<<<"
#
# then call:
#
# >>>a b c d e f && test<<<
# /bin/bash a.sh a b c "d e" f \&\& test
# >>>"a" "b" "c" "d e" "f" \&\& "test"<<<
# >>>"a" "b" "c" "d e" "f" && "test"<<<
# >>>"a"
# - "b"
# - "c"
# - "d e"
# - "f" \&\&
# - "test"<<<
# >>>a b c d e f && test<<<

___PARAMS=""
___EVAL=""
___MULTILINE=""
while (( "${#}" )); do
  if [ "${1}" = "&&" ]; then
      ___PARAMS="${___PARAMS} \&\&"
      ___EVAL="${___EVAL} &&"
      ___MULTILINE="${___MULTILINE} \&\&"
  else
    if [ "${___PARAMS}" = "" ]; then
        ___PARAMS="\"${1}\""
        ___EVAL="\"${1}\""
        ___MULTILINE="\"${1}\""
    else
      ___PARAMS="${___PARAMS} \"${1}\""
      ___EVAL="${___EVAL} \"${1}\""
      ___MULTILINE="$(cat <<EOF
${___MULTILINE}
- "${1}"
EOF
)"
    fi
  fi
  shift;
done

# put back all parameters
eval set -- "${___PARAMS}"
