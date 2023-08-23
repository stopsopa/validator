// import path from "path";

// import fs from "fs";

// import Koa from "koa";

// import serve from "koa-static";

// import * as dotenv from "dotenv";

// import { fileURLToPath } from "url";

// import template from "./lib/template.js";

// const __filename = fileURLToPath(import.meta.url);

// const __dirname = path.dirname(__filename);

const path = require("path");

const fs = require("fs");

const Koa = require("koa");

const serve = require("koa-static");

const dotenv = require("dotenv");

const template = require("./lib/template.js");

/**
 * node jasmine/server_koa.js --web ../ --env .env
 */
const log = (function () {
  try {
    return console.log;
  } catch (e) {
    return function () {};
  }
})();

const args = (function (obj, tmp) {
  process.argv.slice(2).map((a) => {
    if (a.indexOf("--") === 0) {
      tmp = a.substring(2).replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1");

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
      } catch (e) {
        //
      }
    }
  });

  Object.keys(obj).map((k) => {
    obj[k] !== true && obj[k].length === 1 && (obj[k] = obj[k][0]);
    obj[k] === "false" && (obj[k] = false);
  });

  return {
    count: () => Object.keys(obj).length,
    all: () => JSON.parse(JSON.stringify(obj)),
    get: (key, def) => {
      var t = JSON.parse(JSON.stringify(obj));

      if (typeof def === "undefined") return t[key];

      return typeof t[key] === "undefined" ? def : t[key];
    },
    string: (key, def) => {
      var t = JSON.parse(JSON.stringify(obj));

      return typeof t[key] === "string" ? t[key] : def;
    },
  };
})({});

const readFile = (file) => fs.readFileSync(file).toString();

const th = (msg) => new Error(`${__filename} error: ${msg}`);

const web = args.get("web");

if (typeof web !== "string") {
  throw th(`--web arg is not defined`);
}

if (!fs.lstatSync(web).isDirectory()) {
  throw th(`--web path >${web}< is not a directory`);
}

const asset_list = args.get("asset_list");

let tests_list_paths = undefined;

if (typeof asset_list === "string") {
  if (!fs.existsSync(asset_list)) {
    throw th(`file --asset_list >${asset_list}< doesn't exist`);
  }

  tests_list_paths = fs
    .readFileSync(asset_list, "utf8")
    .toString()
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  // checking if all listed files exist
  let i = 0;
  for (const file of tests_list_paths) {
    if (!fs.existsSync(file)) {
      throw th(`file ${file} (tests_list_paths[${i}]) doesn't exist`);
    }
    i += 1;
  }

  log(JSON.stringify(tests_list_paths, null, 4));
}

const env = args.get("env");

if (typeof env !== "string") {
  throw th(`--env arg is not defined`);
}

if (!fs.existsSync(env)) {
  throw th(`file ${env} doesn't exist`);
}

dotenv.config({
  path: env,
});

if (!/^\d+$/.test(process.env.NODE_API_PORT)) {
  throw th(`NODE_API_PORT is not defined`);
}

const port = process.env.NODE_API_PORT;

if (typeof process.env.NODE_API_HOST !== "string") {
  throw th(`NODE_API_HOST is not defined`);
}

const host = process.env.NODE_API_HOST;

const app = new Koa();

const templateFile = path.resolve(__dirname, "jasmine.playwright.html");

const staticFile = path.resolve(__dirname, "index.html");

app.use(async (ctx, next) => {
  if (tests_list_paths && (ctx.url === "/" || ctx.url.startsWith("/?"))) {
    log(`ctx.url (template mode) >${ctx.url}<`);

    const html = template(readFile(templateFile))({ tests_list_paths });

    ctx.body = html;

    fs.writeFileSync(staticFile, html);
  } else {
    log(`ctx.url >${ctx.url}<`);
  }

  if (ctx.url === "/healthcheck") {
    ctx.body = "jasmine healthy";
  }

  if (ctx.url === "/exit") {
    process.exit();
  }

  await next();
});

app.use(
  serve(web, {
    index: false,
  }),
);

app.listen(port, async () => {
  log(
    `\n 🌎 ${new Date().toISOString().substring(0, 19).replace("T", " ")} Koa server is running http://${host}:${port}`,
  );
});
