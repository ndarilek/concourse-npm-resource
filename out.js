#!/usr/bin/env node

var spawn = require("child_process").spawn

process.stdin.on("data", (chunk) => {
  const data = JSON.parse(chunk)
  const source = data.source
  const username = source.username
  if(!username) {
    console.error("Please specify a username.")
    process.exit(1)
  }
  const password = source.password
  if(!password) {
    console.error("Please specify a password.")
    process.exit(1)
  }
  const email = source.email
  if(!email) {
    console.error("Please specify an email address.")
    process.exit(1)
  }
  const npmLogin = spawn("npm", ["login"])
  npmLogin.stderr.pipe(process.stderr)
  npmLogin.stdout.pipe(process.stderr)
  npmLogin.stdin.write(`${username}\n`)
  setTimeout(() => {
    npmLogin.stdin.write(`${password}\n`)
    setTimeout(() => npmLogin.stdin.write(`${email}\n`), 1000)
  }, 1000)
  npmLogin.on("error", (err) => {
    console.error(err)
    process.exit(1)
  })
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
    var args = ["publish"]
    const access = params.access
    if(access && ["public", "restricted"].indexOf(access) == -1) {
      console.err("Specified access ("+access+") is neither `public` nor `restricted`.")
      process.exit(1)
    }
    args.push("--access", access)
    const cwd = `${process.argv[2]}/${path}`
    const npmPublish = spawn("npm", args, {cwd: cwd})
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
