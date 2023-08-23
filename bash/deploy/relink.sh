# /bin/bash bash/deploy/relink.sh

set -e
set -x

_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"

CURRENT="$(dirname "${_DIR}")"
CURRENT="$(dirname "${CURRENT}")"

CD="$(dirname "${CURRENT}")"

CURRENT="$(basename ${CURRENT)}"

unlink "${_DIR}/../../../current" || true

(cd "${CD}" && ln -s "${CURRENT}" current);
