#!/bin/bash
while IFS= read -r line; do
  printf '[%s %s %s]%s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$1" "$2" "$line" 
done

# full example how to use it: https://stopsopa.github.io/pages/bash/index.html?admin:password#prepend-date-to-each-stream-line


# cat <<EEE > dlogger.sh
# #!/bin/bash
# while IFS= read -r line; do
#   printf '[%s %s %s]%s\n' "\$(date '+%Y-%m-%d %H:%M:%S')" "\$1" "\$2" "\$line" 
# done
# EEE


# # then call
# rm -rf log.log | true

# node -e "
# const {EOL} = require('os');
# let k = 5;
# (function loop() {
#   if (k !== 0) {
#     setTimeout(loop, 1000);
#   }
#   process.stdout.write('stdout: ' + k + EOL);
#   process.stderr.write('stderr: ' + k + EOL);
#   k -= 1;
# }());
# " 1> >(/bin/bash dlogger.sh o devserver >> log.log) 2> >(/bin/bash dlogger.sh e devserver >> log.log)