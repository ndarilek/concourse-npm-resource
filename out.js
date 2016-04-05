#!/usr/bin/env node

var spawn = require("child_process").spawn

process.stdin.on("data", (chunk) => {
  const data = JSON.parse(chunk)
  const source = data.source
  const npmLogin = spawn("npm login")
  npmLogin.stderr.pipe(process.stderr)
  npmLogin.stdout.pipe(process.stderr)
  npmLogin.stdin.write(`${source.username}\n`)
  npmLogin.stdin.write(`${source.password}\n`)
  npmLogin.stdin.write(`${source.email}\n`)
  npmLogin.on("exit", (code) => {
    if(code)
      process.exit(code)
    const params = data.params
    if(!params) {
      console.error("Please specify params.")
      process.exit(1)
    }
    const path = params.path
    if(!path) {
      console.error("Missing `path` param")
      process.exit(1)
    }
    const cwd = `${process.argv[2]}/${path}`
    const npmPublish = spawn("npm publish", {cwd: cwd})
    npmPublish.stdout.pipe(process.stderr)
    npmPublish.stderr.pipe(process.stderr)
    var output = ""
    npmPublish.on("data", (data) => output += data.toString())
    npmPublish.on("exit", (code) => {
      if(code)
        process.exit(1)
      const lines = output.split("\n")
      const line = lines[lines.length-1]
      if(line.startsWith("+")) {
        const tokens = line.split("@")
        const version = tokens[tokens.length-1]
        if(version) {
          console.log(JSON.stringify({version: {number: version}}))
          process.exit(0)
        } else {
          console.error("Didn't get a version.")
          process.exit(1)
        }
      }
    })
  })
})
