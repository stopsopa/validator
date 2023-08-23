if (process.argv[2] === "--help" || process.argv.length < 3) {
  console.log(`

Script checking if port is free and can be allocated, usage:
  
  Mode 1:

    node ${__filename} localhost:80   
    node ${__filename} 0.0.0.0:8080 
    
    script echos to console 1 if port is free or 0 if port can't be taken (no access or already used)
    
    exit code in both cases will be 0
    
    if any other error appear then it will show as unhandled error and thus will cause exit code to be non zero  
  
  Mode 2:

    node ${__filename} localhost:80 -v
    node ${__filename} 0.0.0.0:8080 -v
    
    script echos human readable message whether port is free or not
       
    if port is free exit code will be 0
    
    if it is not free exit code will be non 0      
  
`);

  process.exit(1);
}

if (typeof process.argv[2] !== "string") {
  throw new Error(`process.argv[2] !== 'string'`);
}

const reg = /^(localhost|\d{1,2}\.\d{1,2}\.\d{1,2}\.\d{1,2}):(\d+)$/;

const match = process.argv[2].match(reg);

if (match === null) {
  throw new Error(`process.argv[2] (${process.argv[2]}) don't match: ${reg}`);
}

const host = match[1];

const port = parseInt(match[2], 10);

const v = process.argv.includes("--verbose") || process.argv.includes("-v");

const http = require("http");

const app = http.createServer(() => {});

app
  .listen(port, host, () => {
    if (v) {
      console.log(`node ${__filename}: port ${host}:${port} is free`);
    } else {
      process.stdout.write("1");
    }

    process.exit(0);
  })
  .on("error", (e) => {
    const s = String(e);

    // if (s.includes(' EADDRINUSE ') || s.includes(' EACCES ')) {
    if (e.code === "EADDRINUSE" || e.code === "EACCES") {
      // https://nodejs.org/api/net.html#net_server_listen

      if (v) {
        console.log(`node ${__filename} error: port ${host}:${port} is not free: ${s}`);

        process.exit(1);
      } else {
        process.stdout.write("0");

        process.exit(0);
      }
    } else {
      console.log(`node ${__filename} error: port ${host}:${port} is not free due to unknown reason:`);

      throw e;
    }
  });
