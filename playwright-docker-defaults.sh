
S="\\"

PLAYWRIGHT_TEST_MATCH_DEFAULT=""
if [ "${PLAYWRIGHT_TEST_MATCH}" != "" ]; then
    PLAYWRIGHT_TEST_MATCH_DEFAULT="--env PLAYWRIGHT_TEST_MATCH"
fi   

NODE_API_PORT_DEFAULT=""
if [ "${NODE_API_PORT}" != "" ]; then
    NODE_API_PORT_DEFAULT="--env NODE_API_PORT"
fi  

cat <<EOF
-w "/code" $S
${NODE_API_PORT_DEFAULT} $S
${MYSQL_DB_CHANGE_DEFAULT} $S
${PLAYWRIGHT_TEST_MATCH_DEFAULT} $S
${MYSQL_HOST_PASS} $S
-v "\$(pwd)/tests:/code/tests" $S
-v "\$(pwd)/validator:/code/validator" $S
-v "\$(pwd)/jasmine:/code/jasmine" $S
-v "\$(pwd)/node_modules:/code/node_modules" $S
-v "\$(pwd)/playwright-async.config.js:/code/playwright-async.config.js" $S
-v "\$(pwd)/playwright.config.js:/code/playwright.config.js" 
EOF

