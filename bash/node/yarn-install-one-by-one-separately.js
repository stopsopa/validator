/**
 * This is just helper for bash script yarn-install-one-by-one-separately.sh which should be around somewhere
 * in directory where you found THIS file.
 */
const path = require("path");

const fs = require("fs");

const shfile = path.resolve(__dirname, "yarn-install-one-by-one-separately.js");

const th = (msg) => new Error(`yarn-install-one-by-one-separately.js error: ${msg}`);

if (!fs.existsSync(shfile)) {
  throw th(`file '${shfile}' doesn't exist`);
}

const lib = process.argv[2];

let packageJsonPath = process.cwd();

if (lib) {
  packageJsonPath = path.resolve(packageJsonPath, "node_modules", lib);
}

packageJsonPath = path.resolve(packageJsonPath, "package.json");

if (!fs.existsSync(packageJsonPath)) {
  throw th(`${packageJsonPath} doesn't exist`);
}

let packageJsonContent, packageJson;

try {
  packageJsonContent = fs.readFileSync(packageJsonPath, "utf8").toString();

  packageJson = JSON.parse(packageJsonContent);
} catch (e) {
  throw th(`extracting json from file ${packageJsonPath} failed: ${e}`);
}

let list = {};

try {
  list = {
    ...packageJson.devDependencies,
    ...packageJson.dependencies,
  };
} catch (e) {
  throw th(`extracting devDependencies and dependencies from file ${packageJsonPath} failed: ${e}`);
}

const libraries = Object.keys(list).reduce((acc, key) => {
  acc.push(`${key}@${list[key]}`);

  return acc;
}, []);

process.stdout.write(libraries.join("\n"));
