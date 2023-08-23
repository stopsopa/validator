
# https://www.tldp.org/LDP/abs/html/x17129.html
# g(18.1. A Brief Introduction to Regular Expressions)

if [ "${1}" = "--help" ]; then

cat << EOF
Script generate next version based on given version
Available options:

    /bin/bash ${0} 0.0.1 patch
        # 0.0.2

    /bin/bash ${0} v0.0.99 patch
        # v0.0.100


    /bin/bash ${0} 6.4.3 minor
        # 6.5.0

    /bin/bash ${0} 6.04.3 minor
        # 6.5.0

    /bin/bash ${0} ver6.04.3 minor
        # ver6.5.0


    /bin/bash ${0} 6.4.3 major
        # 7.0.0

    /bin/bash ${0} 06.04.3 major
        # 7.0.0

    /bin/bash ${0} v6.04.3 major
        # v7.0.0


    # default is patch
    /bin/bash ${0} 0.0.1
        # 0.0.2

    /bin/bash ${0} v0.0.1
        # v0.0.2

    # postfix doesn't matter, it will be just copied
    /bin/bash ${0} v34.65.109-dev minor
        # v34.66.0-dev

EOF

    exit 0
fi

if [ ${#} -lt 1 ] ; then

    echo "not enough arguments";

    echo -e "run:\n/bin/bash ${0} v4.5.7 patch|minor|major";

    exit 1;
fi

VER="${1}"

PREFIX=""
V1=""
V2=""
V3=""
POSTFIX=""

TEST1="^([0-9]+)\.([0-9]+)\.([0-9]+)(.*)$"

TEST2="^([a-zA-Z-]+)([0-9]+)\.([0-9]+)\.([0-9]+)(.*)$"

if [[ ${VER} =~ ${TEST1} ]]; then

    V1=${BASH_REMATCH[1]}
    V2=${BASH_REMATCH[2]}
    V3=${BASH_REMATCH[3]}
    POSTFIX=${BASH_REMATCH[4]}

elif [[ ${VER} =~ ${TEST2} ]]; then

    PREFIX=${BASH_REMATCH[1]}
    V1=${BASH_REMATCH[2]}
    V2=${BASH_REMATCH[3]}
    V3=${BASH_REMATCH[4]}
    POSTFIX=${BASH_REMATCH[5]}

else

    echo -e "VER: should match regex '${TEST1}' or '${TEST2}' but it is >>>${VER}<<<";

    exit 2
fi

shift;

MODE="${1}"

if [ "${MODE}" = "" ]; then

    MODE="patch"
fi

TEST="^(patch|minor|major)$"

if ! [[ ${MODE} =~ ${TEST} ]]; then

    echo -e "MODE: should match one of values (patch|minor|major) but it is >>>${MODE}<<<";

    exit 3;
fi

V1=$((V1+0));
V2=$((V2+0));
V3=$((V3+0));

if [ "${MODE}" = "patch" ]; then

    V3=$((V3+1));
fi

if [ "${MODE}" = "minor" ]; then

    V2=$((V2+1));
    V3="0"
fi

if [ "${MODE}" = "major" ]; then

    V1=$((V1+1));
    V2="0"
    V3="0"
fi

printf "${PREFIX}${V1}.${V2}.${V3}${POSTFIX}";

#echo ">>>${VER}<<< >>>${MODE}<<< >PREFIX>>${PREFIX}<<< >V1>>${V1}<<< >V2>>${V2}<<< >V3>>${V3}<<< >POSTFIX>>${POSTFIX}<<<";
