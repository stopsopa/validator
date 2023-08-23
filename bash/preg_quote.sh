
#T="qwe|rt{yu}io(pa)sd[fg]hj^kl\$zx+cv*bn?mq.we/rtyuiopasdfghjklzxcvbnm"
#echo "${T}"
#
## escaping [
## https://stackoverflow.com/a/27973573
#echo "${T}" | sed -E "s/([][|\\{}()^$\\+*\\?\\.\/])/\\\\\1/g"

echo "${1}" | sed -E "s/([][|\\{}()^$\\+*\\?\\.\\/])/\\\\\1/g"

