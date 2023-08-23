/**
 * node ${0} v14.4
 * node ${0} --nvmrc .nvmrc
 *
 * node ${0} v14.4.0 --exact
 * node ${0} --nvmrc .nvmrc --exact
 */

const fs = require("fs");

var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;

function pregQuote(str) {
  if (typeof str !== "string") {
    return false;
  }

  return str.replace(matchOperatorsRe, "\\$&");
}

function trim(string, charlist, direction) {
  if (typeof string !== "string") {
    return false;
  }

  direction = direction || "rl";
  charlist = pregQuote(charlist || "");
  charlist = charlist || " \\n";
  direction.indexOf("r") + 1 && (string = string.replace(new RegExp("^(.*?)[" + charlist + "]*$", "gm"), "$1"));
  direction.indexOf("l") + 1 && (string = string.replace(new RegExp("^[" + charlist + "]*(.*)$", "gm"), "$1"));
  return string;
}

let toCheck = process.argv.indexOf("--nvmrc");

if (toCheck > -1) {
  toCheck = process.argv[toCheck + 1];

  if (!fs.existsSync(toCheck)) {
    throw new Error(`file '${toCheck}' doesn't exist`);
  }

  toCheck = fs.readFileSync(toCheck, "utf8").toString();
} else {
  toCheck = process.argv[2];
}

if (typeof toCheck !== "string") {
  throw new Error(
    `typeof toCheck !== 'string', provide as first argument like v14.4 or provide path to .nvmrc using --nvmrc [filepath] argument`
  );
}

if (!toCheck.trim()) {
  throw new Error(
    `toCheck is an empty string, provide as first argument like v14.4 or provide path to .nvmrc using --nvmrc [filepath] argument`
  );
}

toCheck = trim(toCheck);

let ver = process.version;

// JSON.stringify('v14.4.0'.match(/^(v?\d+\.\d+)(\.\d+)?$/), null, 4)
// "[
// "v14.4.0",
//   "v14.4",
//   ".0"
// ]"

// JSON.stringify('v14.4'.match(/^(v?\d+\.\d+)(\.\d+)?$/), null, 4)
// "[
// "v14.4",
//   "v14.4",
//   null
// ]"
const reg = /^(v?\d+\.\d+)(\.\d+)?$/;

const parts = toCheck.match(reg);

if (!Array.isArray(parts) || parts.length !== 3) {
  throw new Error(`extracting minor version ${reg} from given version to compare '${toCheck}' didn't worked`);
}

if (process.argv.indexOf("--exact") === -1) {
  toCheck = parts[1];

  ver = ver.split(".");

  ver.pop();

  ver = ver.join(".");
}

if (ver !== toCheck) {
  throw new Error(`${__dirname} error: Version of node should be '${toCheck}' but it is '${ver}'`);
}

console.log(`Version of node is ${ver} and it should be ${toCheck} - so it's valid`);
