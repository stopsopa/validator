
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */

require('dotenv').config();

// const th = (msg) => new Error(`playwright-async.config.js error: ${msg}`);
//
// const protocolRegex = /^https?:\/\//;
//
// function envcheck(name) {
//   if (typeof process.env[name] !== "string") {
//     throw th(`process.env.${name} is not a string`);
//   }
//
//   if (!process.env[name].trim()) {
//     throw th(`process.env.${name} is an ampty string`);
//   }
// }
//
// envcheck("BASE_URL");
//
// if (!protocolRegex.test(process.env.BASE_URL)) {
//   throw th(`process.env.BASE_URL don't match ${protocolRegex}`);
// }

const delay = ms => new Promise(res => setTimeout(res, ms));

/**
 * Collect any params you need here, sync or async way
 * You will end up with object which you can use
 * to assemble playwright.config.js normal synchronous way.
 */
(async function () {

  const data = {
    start: true,
  };

  // await delay(3000);

  data.end = true;

  console.log(JSON.stringify(data));
}());