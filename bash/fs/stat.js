/**
 * this is just piece of code to extract modification date, create date, and other through node.js because
 * stat bash tool is not standarised
 */

const fs = require("fs");
const err = (msg) => {
  console.log(msg);
  process.exit(1);
};
if (typeof process.argv[2] !== "string") err(`process.argv[2] is not a string`);
if (!fs.existsSync(process.argv[2])) err(`process.argv[2] doesn't exist`);
let stats = fs.lstatSync(process.argv[2]);
stats.whatIsWhat = "https://nodejs.org/api/fs.html#fs_stats_atime";
if (process.argv[3]) {
  const s = stats[process.argv[3]];
  process.stdout.write(s instanceof Date ? s.toISOString() : String(s));
  process.exit(0);
}
console.log(
  JSON.stringify(stats, null, 4)
    .split("\n")
    .map((m) => m.trim())
    .join("\n")
);
