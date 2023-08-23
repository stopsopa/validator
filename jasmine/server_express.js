/**
 * Not production ready
 * some functionalities from server_koa would need to be replicated here
 */

const path = require("path");

const fs = require("fs");

const express = require("express");

const log = (function () {
  try {
    return console.log;
  } catch (e) {
    return function () {};
  }
})();

// https://stackoverflow.com/a/23613092
const serveIndex = require("serve-index");

const env = path.resolve(__dirname, ".env");

if (!fs.existsSync(env)) {
  throw new Error(`File ${env} doesn't exist`);
}

require("dotenv").config({
  path: env,
});

if (!/^\d+$/.test(process.env.NODE_API_PORT)) {
  throw new Error(`jasmine/server_express.js error: NODE_API_PORT is not defined`);
}

const host = process.env.NODE_API_HOST;

const port = process.env.NODE_API_PORT;

const web = path.resolve(__dirname, "..");

const app = express();

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

// app.use(async (ctx, next) => {

//     log(`ctx.url >${ctx.url}<`);

//     await next();
// })

app.use(
  express.static(web, {
    // http://expressjs.com/en/resources/middleware/serve-static.html
    // maxAge: 60 * 60 * 24 * 1000 // in milliseconds
    maxAge: "356 days", // in milliseconds max-age=30758400
    setHeaders: (res, path) => {
      if (/\.bmp$/i.test(path)) {
        // for some reason by default express.static sets here Content-Type: image/x-ms-bmp

        res.setHeader("Content-type", "image/bmp");
      }

      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
      // res.setHeader('Cache-Control', 'public, no-cache, max-age=30758400')
      // res.setHeader('Cache-Control', 'public, only-if-cached')
    },
  }),
  serveIndex(web, {
    icons: true,
    view: "details",
    hidden: false, // Display hidden (dot) files. Defaults to false.
  }),
);

app.listen(port, host, () => {
  console.log(`\n 🌎  Server is running ` + `http://${host}:${port}\n`);
});
