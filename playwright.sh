
S="\\" # will be used later

# current shell name reliably
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

cd "${_DIR}"

node -v 1> /dev/null 2> /dev/null

if [ "${?}" != "0" ]; then

  echo "${0} error: node.js is not available"

  exit 1
fi

GRAY=$(tput setaf 244)
BLACK=$(tput setaf 0)
RED=$(tput setaf 1)
GREEN=$(tput setaf 2)
YELLOW=$(tput setaf 3)
BLUE=$(tput setaf 4)
MAGENTA=$(tput setaf 5)
CYAN=$(tput setaf 6)
WHITE=$(tput setaf 7)
BOLD=$(tput bold)
REVERSE=$(tput rev)
RESET=$(tput sgr0)

function quote {
  echo "$1" | sed -E 's/\"/\\"/g'
}

function extractVersion() {

# extracting dependencies.playwright from package.json
PLAYWRIGHT_VER="$(cat <<EOF | node
const fs = require("fs");

const file = "./package.json";

if (!fs.existsSync(file)) {
  throw new Error("playwright.sh error: file " + file + " doesn't exist");
}

if (!fs.lstatSync(file).isFile()) {
  throw new Error("playwright.sh error: path " + file + " is not a file");
}

const package = require(file);

const dependencies = {
  ...package.dependencies,
  ...package.devDependencies,
};

const ver = dependencies.playwright || dependencies['@playwright/test'];

const parts = ver.match(/\d+\.\d+\.\d+/);

if (!parts || parts.length !== 1) {
  throw new Error("playwright.sh error: " + file + " playwright dependency is not defined");
}

process.stdout.write(parts[0]);

EOF
)";

  if [ "${?}" != "0" ]; then

      echo "${0} error: extracting dependencies.playwright from package.json failed";

      exit 1
  fi
}

_TARGET="local";
_HELP="0";
_HEADLESS="--headed"
_ALLOWONLY="--forbid-only"
_PROJECT="--project=chromium"
_TESTAGAINSTHOST="1"
_DOCKERDEFAULTS="./playwright-docker-defaults.sh"
_GENDOCKERDEFAULTS="0"
_GETPLAYWRIGHTVERSION="0"
ENVFILE=".env"

#if [ "${CI}" != "" ]; then
#  _ALLOWONLY="--forbid-only"
#fi

PARAMS=""
_EVAL=""
while (( "$#" )); do
  case "$1" in
    -h|--help)
      _HELP="1";
      shift;
      ;;
    --generate-playwright-docker-defaults)
      _GENDOCKERDEFAULTS="1";
      shift;
      ;;
    --version)
      _GETPLAYWRIGHTVERSION="1";
      shift;
      ;;
    --headless)
      _HEADLESS="";
      shift;
      ;;
    --nohost)
      _TESTAGAINSTHOST="0";
      shift;
      ;;
    -dd|--docker-defaults)
      if [ "$2" = "" ]; then
        echo "$0 error: -dd|--docker-defaults value can't be empty" >&2 
        exit 1;                                          
      fi                 
      if [ ! -f "${_DOCKERDEFAULTS}" ]; then
        echo "$0 error: -dd|--docker-defaults file '${_DOCKERDEFAULTS}' doesn't exist" >&2 
        exit 1;                                          
      fi        
      _DOCKERDEFAULTS="$2";
      shift 2;
      ;;
    -e|--env)
      if [ "$2" = "" ]; then
        echo "$0 error: -e|--env value can't be empty" >&2 
        exit 1;                                          
      fi                 
      if [ ! -f "${ENVFILE}" ]; then
        echo "$0 error: -e|--env file '${ENVFILE}' doesn't exist" >&2 
        exit 1;                                          
      fi        
      ENVFILE="$2";
      shift 2;
      ;;
    --allow-only)
      _ALLOWONLY="";
      shift;
      ;;
    -p|--project)
      if [ "$2" = "all" ]; then                       
        _PROJECT="";
      else                                
        _PROJECT="--project=$2";                                          
      fi        
      shift 2;
      ;;
    -t|--target)
      if [ "$2" = "" ]; then                           
        echo "$0 error: -t|--target value can't be empty" >&2 
        exit 1;                                          
      fi                              
      _TARGET="$2";
      shift 2;
      ;;
    --) # end argument parsing
      shift;
      while (( "$#" )); do          # optional
        if [ "$1" = "&&" ]; then
          PARAMS="$PARAMS \&\&"
          _EVAL="$_EVAL &&"
        else
          if [ "$PARAMS" = "" ]; then
            PARAMS="\"$(quote "$1")\""
            _EVAL="\"$(quote "$1")\""
          else
            PARAMS="$PARAMS \"$(quote "$1")\""
            _EVAL="$_EVAL \"$(quote "$1")\""
          fi
        fi
        shift;                     
      done                          
      break;
      ;;
    -*|--*=) # unsupported flags
      echo "$0 error: Unsupported flag $1" >&2
      exit 1;
      ;;
    *) # preserve positional arguments
      if [ "$1" = "&&" ]; then
          PARAMS="$PARAMS \&\&"
          _EVAL="$_EVAL &&"
      else
        if [ "$PARAMS" = "" ]; then
            PARAMS="\"$(quote "$1")\""
            _EVAL="\"$(quote "$1")\""
        else
          PARAMS="$PARAMS \"$(quote "$1")\""
            _EVAL="$_EVAL \"$(quote "$1")\""
        fi
      fi
      shift;
      ;;
  esac
done

if [ "${_GETPLAYWRIGHTVERSION}" = "1" ]; then
  set -e

  extractVersion

  printf "${PLAYWRIGHT_VER}"

  exit 0;
fi

export ENVFILE
# export it for playwright.config.js to read for -t local mode

if [ "${_GENDOCKERDEFAULTS}" = "1" ]; then

  if [ -f "${_DOCKERDEFAULTS}" ]; then

      echo "$0 error: file '${_DOCKERDEFAULTS}' already exists" >&2 

      exit 1;                 
  fi

cat <<EEE > "${_DOCKERDEFAULTS}"

S="\\\\"

PLAYWRIGHT_TEST_MATCH_DEFAULT=""
if [ "\${PLAYWRIGHT_TEST_MATCH}" != "" ]; then
    PLAYWRIGHT_TEST_MATCH_DEFAULT="--env PLAYWRIGHT_TEST_MATCH"
fi   

NODE_API_PORT_DEFAULT=""
if [ "\${NODE_API_PORT}" != "" ]; then
    NODE_API_PORT_DEFAULT="--env NODE_API_PORT"
fi  

cat <<EOF
-w "/code" \$S
\${NODE_API_PORT_DEFAULT} \$S
\${PLAYWRIGHT_TEST_MATCH_DEFAULT} \$S
-v "\\\$(pwd)/tests:/code/tests" \$S
-v "\\\$(pwd)/node_modules:/code/node_modules" \$S
-v "\\\$(pwd)/playwright.config.js:/code/playwright.config.js" \$S
-v "\\\$(pwd)/playwright-async.config.js:/code/playwright-async.config.js"

EOF

EEE

    exit 0
fi # end of    if [ "${_GENDOCKERDEFAULTS}" = "1" ]; then    condition

trim() {
    local var="$*"
    # remove leading whitespace characters
    var="${var#"${var%%[![:space:]]*}"}"
    # remove trailing whitespace characters
    var="${var%"${var##*[![:space:]]}"}"
    echo -n "$var"
}

if [ "${_HELP}" = "1" ]; then

cat <<EOF

Purpose of this script is to provide the same way to launch test natively on your host machine but also after adding one parameter to launch it in docker exactly the same way.

First you might need to generate file with default parameters for "docker run" internal command (optional: only if you will use "-t docker" mode):
${YELLOW}/bin/bash playwright.sh ${BOLD}--generate-playwright-docker-defaults${RESET}
    # to generate config file ./playwright-docker-defaults.sh

    # you might also specify different path for target 
${YELLOW}/bin/bash playwright.sh --generate-playwright-docker-defaults ${BOLD}--docker-defaults ./playwright-docker-defaults2.sh${RESET}
    # but from now on you will have to always specify extra parameter (for "-t docker" mode)
        --docker-defaults ./playwright-docker-defaults2.sh
    # because by default it is
        --docker-defaults ./playwright-docker-defaults.sh

    # ${GREEN}NOTICE${RESET}: you might also reset injecting any default params by passing /dev/null and then defining everything manually using double -- delimiters
        ${YELLOW}/bin/bash playwright.sh -t docker --docker-defaults /dev/null -- [params for "docker run"] -- [params for internal execution of playwright]

${YELLOW}/bin/bash playwright.sh ${BOLD}--env .env_test_against_cra${RESET}${YELLOW} -- --debug tests/e2e/sandbox/img.spec.js${RESET}
    # by default playwright.sh script reads file .env in search for env vars but you might change it providing -e|--env param
    # using this option will work for local and docker mode too

${YELLOW}/bin/bash playwright.sh ${BOLD}--target local${RESET}${YELLOW} -- ... optionally other native params for playwright${RESET}  
    # ${BOLD}--target local${RESET} is actually by default, so you don't really need to specify --target to launch on "local"
    # but you have to specify it if you want to launch test in docker using ${BOLD}--target docker${RESET}
${YELLOW}/bin/bash playwright.sh ${BOLD}--target docker${RESET}${YELLOW} -- ... optionally other native params for playwright${RESET}
    # shortcut is ${BOLD}-t${RESET}

${YELLOW}/bin/bash playwright.sh ${BOLD}--headless${RESET}${YELLOW} -- ... optionally other native params for playwright${RESET}
    # it's here because ${BOLD}--headed${RESET} is added by default (by default in "--target local" but not in "--target docker")
    # WARNING: be aware that this params is handled/consumed by this script only 

${YELLOW}/bin/bash playwright.sh ${BOLD}--allow-only${RESET}${YELLOW} -- ... optionally other native params for playwright${RESET}
    # it's here because native playwright cli option ${BOLD}--forbid-only${RESET} is added by default in this script
    # but not natively, natively in playwright it.only() is allowed by default
    # this this flag --allow-only is consumed by this bash script in order to bring back default behavior of playwright cli
    # WARNING: be aware that this params is handled/consumed by this script only  

${YELLOW}/bin/bash playwright.sh -- ${BOLD}--workers=5${RESET}
    # this will override hardcoded ${BOLD}--workers=1${RESET} (which is added by default)

${YELLOW}/bin/bash playwright.sh ${BOLD}--project firefox${RESET}${YELLOW} -- ... optionally other native params for playwright${RESET} 
    or
${YELLOW}/bin/bash playwright.sh ${BOLD}--project all${RESET}${YELLOW} -- ... optionally other native params for playwright${RESET}
    # WARNING: --project param given to playwright.sh should have format:
    #               ${BOLD}--project firefox${RESET}
    #                   not
    #               ${BOLD}--project=firefox${RESET}
    # it's here because ${BOLD}--project chromium${RESET} is added by default
    # ${BOLD}--project firefox${RESET}   - this will change browser to firefox
    # ${BOLD}--project all${RESET}       - this will launch against all registered browsers (registered in playwright.config.js)
    #       (this will internally in this bash script force to not pass --project arg to playwright - this way test will be executed against all registered browsers)

    # WARNING: be aware that this params is handled/consumed by this script only  
        # there is one edge case
            /bin/bash playwright.sh ${BOLD}--project all${RESET} -- ${BOLD}--project=firefox${RESET} ... optionally other native params for playwright
                this is the same as 
            /bin/bash playwright.sh ${BOLD}--project firefox${RESET} -- ... optionally other native params for playwright
    # shortcut is ${BOLD}-p${RESET}

${GREEN}ALL PARAMS BELOW ARE USED ONLY IF playwright.sh IS SWITCHED TO ${BOLD}--target docker${RESET}${GREEN} mode:${RESET}

${YELLOW}/bin/bash playwright.sh -t docker ${BOLD}--nohost${RESET} ${YELLOW} -- ... optionally other native params for playwright${RESET}
    # WARNING: be aware that this params is handled/consumed by this script only  
    # it is here to explicitly NOT add to "docker run" parameters:
    # --net host
    #   or
    # --env NODE_API_HOST=host.docker.internal
    # depends what OS will be detected

Up to this point you've probably noticed that we are using delimiter ${RED}--${RESET} to separate parameters for playwright.sh script and parameters for playwright itself.
But in "-t docker" mode we can use TWO pairs of ${RED}--${RESET} delimiter, this way we will have more control over not only playwright but also we will be able to inject some extra parameters to "docker run" itself.
Example:
    ${YELLOW}/bin/bash playwright.sh -t docker --nohost ${RED}--${YELLOW} -v "\$(pwd)/.env_docker:/code/.env" ${RED}--${RESET}
        # this way by using --nohost we will not inject --env NODE_API_HOST=host.docker.internal (in MAC case) and we can provide different .env_docker with NODE_API_HOST env var and mount it inside container as /code/.env
        #    (this might be useful for launching docker tests against external domain - not against server on host/dev machine)

        # ${RED}WARNING${RESET}: important part here is that at the end we have second ${RED}--${RESET}, this way we are clearly indicating that parameter
        #    -v "\$(pwd)/.env_docker:/code/.env"
        # is for "docker run"
        # not for playwright tool executed inside container
    # Obviously this way we can inject some params to playwright too: 
    ${YELLOW}/bin/bash playwright.sh -t docker --nohost ${RED}--${YELLOW} -v "\$(pwd)/.env_docker:/code/.env" ${RED}--${YELLOW} --list${RESET}
        # this way "docker run" will get extra param:
            -v "\$(pwd)/.env_docker:/code/.env"
        # and playwright will get
            --list
        # ${GREEN}NOTICE${RESET}: It is worth understanding that if one pair of delimiter -- is used then actually 
            -v "\$(pwd)/.env:/code/.env"
        # is set by default, and by specifying
            -v "\$(pwd)/.env_docker:/code/.env"
        # we are effectively replacing default mounting of .env with mounting .env_docker in it's place instead
        # another consequence of that is that if you would really want to add any extra parameter beyond those defined in playwright-docker-defaults.sh
        # but keep -v "\$(pwd)/.env:/code/.env" unchanged it is still necessary to specify -v "\$(pwd)/.env:/code/.env" and extra params like --name after it, like:
           ${YELLOW}/bin/bash playwright.sh -t docker --nohost ${RED}--${YELLOW} -v "\$(pwd)/.env:/code/.env" --name my_container_name ${RED}--${YELLOW} --list${RESET}
        
        # executing 
           ${YELLOW}/bin/bash playwright.sh -t docker --nohost ${RED}--${YELLOW} --name my_container_name ${RED}--${YELLOW} --list${RESET}
        # will not work because this way we are not setting .env at all

        # Other way of thinking about it is that params defined in playwright-docker-defaults.sh file are injected separately from mounting .env into container
        # and this is done deliberately to have more flexibility in injecting different .env files for different purposes without need to manipulate playwright-docker-defaults.sh.

        # Yet another way of thinking is treating playwright-docker-defaults.sh as reversed .gitignore to define what from our project SHOULD be mounted into our container for testing.
        # By "reversed" .gitignore I meain the fact that .gitignore specifies what should be OMITTED (not included), where playwright-docker-defaults.sh describes what should be MOUNTED into container.

        # So at this point you can see that playwright-docker-defaults.sh and double -- works independently mainly to mount any .env without need to manipulate playwright-docker-defaults.sh
        # In other words: by design developer is encouraged to use more often double -- delimters to switch different .env files over changing playwright-docker-defaults.sh files - this should be more rare.
            
EOF

  exit 0

fi

PARAMS="$(trim "$PARAMS")"
_EVAL="$(trim "$_EVAL")"

eval set -- "$PARAMS"

if [ "${_TARGET}" = "local" ]; then

  set -e

  if [ ! -f "node_modules/.bin/playwright" ]; then

    echo "${0} error: node_modules/.bin/playwright doesn't exist"

    exit 1
  fi

  cat <<EEE

  node node_modules/.bin/playwright test ${_HEADLESS} ${_ALLOWONLY} ${_PROJECT} --workers=1 $@

EEE

  node node_modules/.bin/playwright test ${_HEADLESS} ${_ALLOWONLY} ${_PROJECT} --workers=1 $@

  exit 0
fi

if [ "${_TARGET}" = "docker" ]; then

  set -e

  if [ "${_TESTAGAINSTHOST}" = "1" ]; then
      if [[ "$OSTYPE" == "darwin"* ]]; then
          _HOSTHANDLER="--env NODE_API_HOST=host.docker.internal"
      else
          _HOSTHANDLER="--net host"
      fi
  fi

  # handling double -- on the list of arguments vvv
  DOUBLEDASH="0"
  for ARG in "$@"; do
  #   echo ">${ARG}<"
    if [ "${ARG}" = "--" ]; then
      DOUBLEDASH="$((${DOUBLEDASH}+1))"
    fi
  done

  DOCKER_PARAMS_NOT_QUOTED="-v \"$(pwd)/${ENVFILE}:/code/.env\""
  PARAMS=""
  _EVAL=""
  DOCKER_PARAMS=""
  DOCKER__EVAL=""

  if [ "${DOUBLEDASH}" -gt "0" ]; then
    _FOR_DOCKER="1"
    for ARG in "$@"; do
      if [ "${ARG}" = "--" ]; then
        _FOR_DOCKER="0"
        continue;
      fi
      if [ "${_FOR_DOCKER}" = "1" ]; then
        if [ "${ARG}" = "&&" ]; then
            DOCKER_PARAMS="$DOCKER_PARAMS \&\&"
            DOCKER__EVAL="$DOCKER__EVAL &&"
            DOCKER_PARAMS_NOT_QUOTED="$DOCKER_PARAMS_NOT_QUOTED \&\&"
        else
            if [ "$DOCKER_PARAMS" = "" ]; then
                DOCKER_PARAMS="\"$(quote "${ARG}")\""
                DOCKER__EVAL="\"$(quote "${ARG}")\""
                DOCKER_PARAMS_NOT_QUOTED="${ARG}"
            else
                DOCKER_PARAMS="$DOCKER_PARAMS \"$(quote "${ARG}")\""
                DOCKER__EVAL="$DOCKER__EVAL \"$(quote "${ARG}")\""
                DOCKER_PARAMS_NOT_QUOTED="$DOCKER_PARAMS_NOT_QUOTED ${ARG}"
            fi
        fi
      else
        if [ "${ARG}" = "&&" ]; then
            PARAMS="$PARAMS \&\&"
            _EVAL="$_EVAL &&"
        else
            if [ "$PARAMS" = "" ]; then
            PARAMS="\"$(quote "${ARG}")\""
            _EVAL="\"$(quote "${ARG}")\""
            else
            PARAMS="$PARAMS \"$(quote "${ARG}")\""
            _EVAL="$_EVAL \"$(quote "${ARG}")\""
            fi
        fi
      fi
    done

    PARAMS="$(trim "$PARAMS")"
    _EVAL="$(trim "$_EVAL")"

    eval set -- "$PARAMS"

    # echo "PARAMS>${PARAMS}<"
    # echo "_EVAL>${_EVAL}<"
    # echo "DOCKER_PARAMS>${DOCKER_PARAMS}<"
    # echo "DOCKER__EVAL>${DOCKER__EVAL}<"
    # echo "DOCKER_PARAMS_NOT_QUOTED>${DOCKER_PARAMS_NOT_QUOTED}<"

  fi
  # handling double -- on the list of arguments ^^^

  # set -x # uncomment if you want to see final command

  DOCKERDEFAULTS="$(/bin/bash "${_DOCKERDEFAULTS}")"

  if [ "${?}" != "0" ]; then

      echo "${0} error: executing '${_DOCKERDEFAULTS}' have failed";

      exit 1
  fi

extractVersion

# testing how to run multiline bash script
# cat <<EEE | docker run --rm -i --entrypoint="" \
# mcr.microsoft.com/playwright:v1.27.1-focal \
# bash
# ls -la
# pwd
# date
# EEE  

CMD="$(cat <<EOF
cat <<EEE | docker run -i --rm --ipc host --cap-add SYS_ADMIN --entrypoint="" $S
${DOCKERDEFAULTS} $S
${DOCKER_PARAMS_NOT_QUOTED} $S
${_HOSTHANDLER} $S
mcr.microsoft.com/playwright:v${PLAYWRIGHT_VER}-focal $S
bash
  set -e
  echo ===========printenv===========
  printenv
  echo ===========printenv===========
  /ms-playwright-agent/node_modules/.bin/playwright test ${_ALLOWONLY} ${_PROJECT} --workers=1 $@
EEE
EOF
)"

# you might to swap this to 
# /ms-playwright-agent/node_modules/.bin/playwright test ${_ALLOWONLY} ${_PROJECT} --workers=1 $@
# to find out run
# docker run -it mcr.microsoft.com/playwright:v1.37.1-focal bash
# not sure yet about this though, I've reverted to previous version to don't deal with it now

  printf "\n$CMD\n\n"

  CMD="${CMD//\\$'\n'/}"

  eval "$CMD"
    
  exit 0
fi # end of    if [ "${_TARGET}" = "docker" ]; then    condition

echo "${0} error: unhandled --target '${_TARGET}'"

exit 1
