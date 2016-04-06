#!/usr/bin/env node

var exec = require("child_process").exec,
  suppose = require("suppose")

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
  const params = data.params
  if(!params) {
    console.error("Please specify params.")
    process.exit(1)
  }
  suppose("npm", ["login"])
  .when(/Username/, username)
  .when(/Password/, password)
  .when(/Email/, email)
  .error((err) => {
    console.err(err.toString())
    process.exit(1)
  }).end((code) => {
    if(code) {
      console.error("Error logging in")
      process.exit(code)
    }
    console.error("Logged in")
    const path = params.path
    if(!path) {
      console.error("Missing `path` param")
      process.exit(1)
    }
    var cmdLine = "npm publish"
    const access = params.access
    if(access && ["public", "restricted"].indexOf(access) == -1) {
      console.err("Specified access ("+access+") is neither `public` nor `restricted`.")
      process.exit(1)
    } else if(access)
      cmdLine += ` --access ${access}`
    const cwd = `${process.argv[2]}/${path}`
    const npmPublish = exec(cmdLine, {cwd: cwd}, (err, stdout, stderr) => {
      if(err) {
        console.error(err)
        process.exit(1)
      }
      const lines = output.split("\n").filter((v) => v)
      const line = lines[lines.length-1]
      if(line.startsWith("+")) {
        const tokens = line.split("@")
        const version = tokens[tokens.length-1]
        if(version) {
          console.log(JSON.stringify({version: {number: version}}))
          process.exit(0)
        } else {
          console.error("Didn't get a version.", lines, line)
          process.exit(1)
        }
      }
    })
  })
})
