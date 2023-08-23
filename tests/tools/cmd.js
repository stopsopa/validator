const { spawnSync } = require("child_process");

const th = (msg) => new Error(`${__filename} error: ${msg}`);

/**
 * Synchronous Process Creation
 * https://nodejs.org/docs/v0.12.0/api/child_process.html#child_process_synchronous_process_creation
 *
 *
 const json = cmd([
 'node',
 'json-outputing-script.js'
 ]);
 */

module.exports = (cmd, opt) => {
  if (typeof cmd === "string") {
    cmd = cmd.trim();

    if (!cmd) {
      throw th(`cmd is an empty string`);
    }

    cmd = cmd.split(/\s+/);
  }

  if (!Array.isArray(cmd)) {
    throw th(`cmd is not an array`);
  }

  if (!cmd.length) {
    throw th(`cmd is an empty array`);
  }

  const { verbose = false } = { ...opt };

  verbose && console.log(`executing command ${c.g(cmd.join(" "))}`);

  const [command, ...args] = cmd;

  const ret = spawnSync(command, args);

  if (ret.status !== 0) {
    ret.cmdErrorMessage = `non zero exit code for command >${cmd.join(" ")}<`;

    throw ret;
  }

  const stdout = ret.stdout.toString();

  let json = null;

  try {
    json = JSON.parse(stdout);
  } catch (e) {
    ret.cmdErrorMessage = `can't parse json stdout from command >${cmd.join(" ")}<, raw JSON.parse error >${e}<`;

    throw ret;
  }

  if (json === null) {
    ret.cmdErrorMessage = `parsing stdout json from command >${cmd.join(
      " "
    )}< still result in null. raw stdout >${stdout}<`;

    throw ret;
  }

  return json;
};
