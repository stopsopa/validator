// import path from "path";

// import fs from "fs";

// import { fileURLToPath } from "url";

const path = require('path');

const fs = require('fs');

// const __filename = fileURLToPath(import.meta.url);

const th = (msg) => new Error(`${__filename} error: ${msg}`);

const file = process.argv[2];

if (typeof file !== "string") {
  throw th(`file arg is not defined`);
}

if (!fs.existsSync(file)) {
  throw th(`file >${file}< doesn't exist`);
}

const web_relative = process.argv[3];

if (web_relative) {
  if (typeof web_relative !== "string") {
    throw th(`web_relative arg is not defined`);
  }

  if (!fs.lstatSync(web_relative).isDirectory()) {
    throw th(`web_relative path >${web_relative}< is not a directory`);
  }
}

const p = {
  ext: path.extname(file).substring(1),
  base: path.basename(file, path.extname(file)),
  path: path.dirname(file),
};

// console.log(p)

const jasmineFile = `${p.path}${path.sep}${p.base}.jasmine-esbuild.${p.ext}`;

let final = jasmineFile;

if (web_relative) {
  final = path.relative(web_relative, final);
}

process.stdout.write(final);
