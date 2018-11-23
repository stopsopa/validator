
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

let reg = /^\[!\[Build Status\]/;

let done = false;
for (let i = 0, l = content.length ; i < l ; i += 1 ) {

    if (reg.test(content[i])) {

        const n = 'v' + package.version;

        content[i] = content[i].replace(/v\d+\.\d+\.\d+/g, n);

        if (content[i].indexOf(n) > -1) {

            done = true;
        }

        break;
    }
}

if ( ! done ) {

    throw `Badge not found or invalid in file '${README_md}'`;

    process.exit(2);
}

fs.writeFileSync(README_md, content.join("\n"));

