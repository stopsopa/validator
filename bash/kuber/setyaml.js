/**
 * Require: "js-yaml": "^3.11.0",
 *
node ../../../bash/kuber/setyaml.js ../deployment-cli-3a0b.yaml --block _ --key ttt --yaml "one: two
three: four"


node "${ROOT}/bash/kuber/setyaml.js" "${JOBYAML}" --block _ --key spec.template.spec.containers.0.command   --yaml "$(cat <<EOF
${YAMLARGS}
EOF
)"

    if:

YAMLARGS="$(cat <<EOF
- /bin/bash
- command.sh
- "--url"
- "http://example.com"
EOF
)"

node ../../../bash/kuber/setyaml.js ../deployment-cli-3a0b.yaml --block _ --key ttt --yaml '{"one": "two", "three": "four"}'

node ../../../bash/kuber/setyaml.js ../deployment-cli-3a0b.yaml --block _ --key ttt.raz.a.b.c.d.e --plain 8.5876 --type float[2]

 # order of params with -- doesn't matter
node ../../../bash/kuber/setyaml.js ../deployment-cli-3a0b.yaml --plain 8.5876 --type float[2] --block _ --key ttt.raz.a.b.c.d.e

 */

const path = require("path");

const fs = require("fs");

const yaml = require("js-yaml");

const log = function (data) {
  console.log(JSON.stringify(data, null, 4));
};

const args = (function (obj, tmp) {
  process.argv.slice(2).map((a) => {
    if (a.indexOf("--") === 0) {
      tmp = a.substring(2).replace(/^\s*(\S*(\s+\S+)*)\s*$/, "${1}");

      if (tmp) {
        obj[tmp] = typeof obj[tmp] === "undefined" ? true : obj[tmp];
      }

      return;
    }

    if (a === "true") {
      a = true;
    }

    if (a === "false") {
      a = false;
    }

    if (tmp !== null) {
      if (obj[tmp] === true) {
        return (obj[tmp] = [a]);
      }

      try {
        obj[tmp].push(a);
      } catch (e) {}
    }
  });

  Object.keys(obj).map((k) => {
    obj[k] !== true && obj[k].length === 1 && (obj[k] = obj[k][0]);
    obj[k] === "false" && (obj[k] = false);
  });

  return {
    all: () => JSON.parse(JSON.stringify(obj)),
    get: (key, def) => {
      var t = JSON.parse(JSON.stringify(obj));

      if (typeof def === "undefined") return t[key];

      return typeof t[key] === "undefined" ? def : t[key];
    },
    update: (data) => {
      obj = data;
    },
  };
})({});

const file = path.resolve(process.cwd(), process.argv[2]);

const block = args.get("block", false);

if (typeof block !== "string") {
  throw new Error(`${__filename} error: block is not a string, use --block argument`);
}

const key = args.get("key", false);

if (typeof key !== "string") {
  throw new Error(`${__filename} error: key is not a string, use --key argument`);
}

let value = undefined;

switch (true) {
  case Boolean(args.get("json", false)):
    try {
      value = args.get("json", false);

      if (typeof value !== "string") {
        throw new Error(`value is not a string`);
      }

      value = JSON.parse(value);
    } catch (e) {
      throw new Error(`${__filename} json parse error: ${e}`);
    }

    break;
  case Boolean(args.get("yaml", false)):
    try {
      value = args.get("yaml", false);

      if (typeof value !== "string") {
        throw new Error(`value is not a string`);
      }

      value = yaml.safeLoad(value);
    } catch (e) {
      throw new Error(`${__filename} yaml parse error: ${e}`);
    }

    break;
  case Boolean(args.get("plain", false)):
    try {
      value = args.get("plain", false);

      if (typeof value !== "string") {
        throw new Error(`value is not a string`);
      }

      let type = args.get("type", false);

      if (type) {
        const parts = type.split(/[\[\]]/g);

        const precision = parseInt(parts[1] || "2", 10);

        if (parts && parts[0]) {
          type = parts[0];
        }

        switch (type) {
          case "integer":
          case "int":
            value = parseInt(value, 10);
            break;
          case "float":
          case "double":
            value = parseFloat(parseFloat(value, 10).toFixed(precision));
            break;
          case "boolean":
          case "bool":
            value = Boolean(value);
            break;
          default:
            throw new Error(
              `type have to be one of integer,int,float,float[5],double,boolean,bool but it is '${type}'`
            );
        }
      }
    } catch (e) {
      throw new Error(`${__filename} plain parse error: ${e}`);
    }

    break;
}

if (value === undefined) {
  throw new Error(`${__filename} value is undefined, use one of parameters --json, --yaml, --plain`);
}

if (!fs.existsSync(file)) {
  throw `${__filename} error: file "${file}" doesn't exist`;
}

try {
  fs.accessSync(file, fs.constants.R_OK);
} catch (e) {
  throw `${__filename} error: file '${file}' is not readdable`;
}

try {
  fs.accessSync(file, fs.constants.W_OK);
} catch (e) {
  throw `${__filename} error: file '${file}' is not writtable`;
}

function isArray(obj) {
  return Object.prototype.toString.call(obj) === "[object Array]";
}

function isObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

function set(source, key, value) {
  if (typeof key === "string") {
    key = key.split(".");
  }

  if (typeof key === "number") {
    key = key + "";
  }

  if (isObject(key)) {
    key = Object.values(key).map((a) => (a += ""));
  }

  if (typeof key !== "string" && !key && key !== "0" && key !== "") {
    key = [];
  }

  if (!isArray(key)) {
    key = [key];
  }

  if (key.length) {
    let first = true;

    let ar = isArray(source);

    if (!ar && !isObject(source)) {
      source = {};
    }

    let kt;

    let tmp = source;

    let tmp2 = source;

    let obb, arr;

    while (key.length) {
      kt = key.shift();

      if (first) {
        first = false;

        if (ar && !/^\d+$/.test(kt) && kt !== "") {
          throw (
            `if source is array and key is not integer nor empty string then its not possible to add to array, given key: ` +
            JSON.stringify(kt)
          );
        }
      }

      tmp = tmp2;

      if (key.length) {
        obb = isObject(tmp[kt]);

        arr = isArray(tmp[kt]);

        if (!(obb || arr)) {
          if (key[0] === "") {
            arr || (tmp[kt] = []);
          } else {
            obb || (tmp[kt] = {});
          }
        }

        tmp2 = tmp[kt];
      } else {
        if (isArray(tmp)) {
          if (kt === "") {
            tmp.push(value);
          } else {
            tmp[kt] = value;
          }
        } else {
          tmp[kt] = value;
        }

        return source;
      }
    }
  }

  return value;
}

function parse(yml) {
  const dic = {};

  if (typeof yml !== "string") {
    throw new Error(`${__filename} error: parse: yml is not a string`);
  }

  yml = yml.split("\n");

  let ind = [],
    i = 0;

  for (let k = 0, l = yml.length; k < l; k += 1) {
    if (!isObject(dic[i])) {
      dic[i] = dic._ = ind[i] = { v: "" };
    }

    if (yml[k].indexOf("---") === 0) {
      i += 1;

      let label = yml[k]
        .replace(/^-+(.*)$/, "$1")
        .trim()
        .toLowerCase();

      if (!isObject(dic[i])) {
        dic[i] = ind[i] = { v: "", r: yml[k] };

        if (isObject(dic[label])) {
          if (typeof dic[label].v === "string") {
            dic[label].e = new Error(`${__filename} error: there are more than one sections with label '${label}'`);
          }
        } else {
          dic[label] = ind[i];
        }
      }

      continue;
    }

    ind[i].v += yml[k] + "\n";
  }

  for (let i = 0, l = ind.length; i < l; i += 1) {
    ind[i].v = yaml.safeLoad(ind[i].v);
  }

  return {
    ind,
    dic,
  };
}

function dump(data) {
  let tmp = "";

  for (let i = 0, l = data.ind.length; i < l; i += 1) {
    if (typeof data.ind[i].r === "string") {
      tmp += data.ind[i].r + "\n";
    }

    tmp += yaml.safeDump(data.ind[i].v).trim() + "\n";
  }

  return tmp;
}

let yml = fs.readFileSync(file, "utf8").toString();

const data = parse(yml);

if (!isObject(data.dic[block])) {
  throw new Error(`${__filename} error: block targeted by string '${block}' is not defined in file '${file}'`);
}

if (!/^\d+$/.test(block) && data.dic[block].e instanceof Error) {
  throw data.dic[block].e;
}

set(data.dic[block].v, key, value);

const saved = dump(data);

fs.writeFileSync(file, saved);

yml = fs.readFileSync(file, "utf8").toString();

yml = dump(parse(yml));

if (yml !== saved) {
  console.log("${__filename} error: couldn't change value");

  process.exit(1);
}

console.log("Success");
