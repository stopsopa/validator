
const fs    = require('fs');

const path  = require('path');

const package = require('./package');

// process.stdout.write(JSON.stringify(package, null, 4));

process.stdout.write(`\n`);
process.stdout.write('update badge -> package.version:');
process.stdout.write(JSON.stringify(package.version, null, 4));
process.stdout.write(`\n\n`);

const README_md = path.resolve(__dirname, 'README.md');


if ( ! fs.existsSync(README_md) ) {

    throw `File '${README_md}' doesn't exist`;

    process.exit(1);
}

let content = fs.readFileSync(README_md).toString();

content = content.split("\n");

let regnpm = /^\[!\[Build Status\]/;
//let regcov = /^\[!\[Coverage Status\]/;
let regcov = /^\[!\[codecov\]/;

const n = 'v' + package.version;

let done = 0;

for (let i = 0, l = content.length ; i < l ; i += 1 ) {

    if (regnpm.test(content[i]) || regcov.test(content[i])) {

        content[i] = content[i].replace(/v\d+\.\d+\.\d+/g, n);

        if (content[i].indexOf(n) > -1) {

            done += 1;
        }

        if ( done === 2) {

            break;
        }
    }
}

if ( done !== 2 ) {

    throw `Badges not found, invalid badges or missing badges in file '${README_md}'`;

    process.exit(2);
}

fs.writeFileSync(README_md, content.join("\n"));

