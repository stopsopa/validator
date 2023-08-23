// DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"
//
// STATUS="0"
//
// while [ "${?}" = "0" ]
//   do
//
//   /bin/bash "${DIR}/start.sh"
//
//   STATUS="$(node "${DIR}/bash/fs/watch.js" "${DIR}/index.js")"
//
//   /bin/bash "${DIR}/stop.sh"
// done

const fs = require("fs");

if (!fs.existsSync(process.argv[2])) {
  throw new Error(`file ${process.argv[2]} doesn't exist`);
}

fs.watchFile(process.argv[2], function () {
  process.exit(0);
});
