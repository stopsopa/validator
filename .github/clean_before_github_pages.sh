
_SHELL="$(ps "${$}" | grep "${$} " | grep -v grep | sed -rn "s/.*[-\/]+(bash|z?sh) .*/\1/p")"; # bash || sh || zsh
case ${_SHELL} in
  zsh)
    _DIR="$( cd "$( dirname "${(%):-%N}" )" && pwd -P )"
    _0="$( basename "${(%):-%N}" )"
    _SCRIPT="${(%):-%N}"
    _BINARY="/bin/zsh"
    _PWD="$(pwd)"
    ;;
  sh)
    _DIR="$( cd "$( dirname "${0}" )" && pwd -P )"
    _0="$( basename "${0}" )"
    _SCRIPT="${0}"
    _BINARY="/bin/sh"
    _PWD="$(pwd)"
    ;;
  *)
    _DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"
    _0="$( basename "${BASH_SOURCE[0]}" )"
    _SCRIPT="${BASH_SOURCE[0]}"
    _BINARY="/bin/bash"
    _PWD="$(pwd)"
    ;;
esac

cd "${_DIR}/.."

set -x
rm -rf .env*
rm -rf .git
rm -rf bash
rm -rf .github
rm -rf .gitignore
rm -rf .husky
rm -rf .npmignore
rm -rf .nvmrc
rm -rf .prettierignore
rm -rf .vscode
rm -rf colors.js
rm -rf combineReducers.js
rm -rf commitlint.config.js
rm -rf controller
rm -rf jest.config.js
rm -rf jest.sh
rm -rf jest.snapshotResolver.js
rm -rf LICENSE
rm -rf Makefile
rm -rf package.dev.json
rm -rf package.json
rm -rf playwright-async.config.js
rm -rf playwright-docker-defaults.sh
rm -rf playwright-report
rm -rf playwright.config.js
rm -rf playwright.sh
rm -rf prettier.config.cjs
rm -rf README.md
rm -rf release.config.js
rm -rf testall.sh
rm -rf yarn.lock

(
    /bin/bash jasmine/clean_node_modules.sh 
)

echo 'after clean_before_github_pages'

ls -la