//
// script will properly export variables defined in .env file,
// where normally they are not prefixed with "export" keyword
//
// USAGE:
//
// override mode - false (default)
// eval "$(node bash/exportsource.js .env.test)"
//
// override mode - true
// eval "$(node bash/exportsource.js .env.test true)"
//

const fs = require("fs");

const err = (msg) => `${__filename} error: ${msg}`;

const th = (msg) => new Error(err(msg));

if (typeof process.argv[2] !== "string" || !process.argv[2].trim()) {
  throw th(`.env file not specified - provide it in first arg`);
}

const env = process.argv[2];

if (!fs.existsSync(env)) {
  throw th(`File ${env} doesn't exist`);
}

const copy = Object.assign({}, process.env);

const list = require("dotenv").config({
  path: env,
});

for (const [key, value] of Object.entries(list.parsed)) {
  if (!process.argv[3] && typeof copy[key] === "string") {
    continue;
  }
  console.log(`export ${key}="${value}"`);
}
