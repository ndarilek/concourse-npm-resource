#!/usr/bin/env node

var exec = require("child_process").exec,
  fs = require("fs")

process.stdin.on("data", (chunk) => {
  const data = JSON.parse(chunk)
  const source = data.source
  if(!source) {
    console.error("Please specify a source.")
    process.exit(1)
  }
  const token = source.token
  if(!token) {
    console.error("Please specify `source.token`.")
    process.exit(1)
  }
  const params = data.params
  if(!params) {
    console.error("Please specify `params`.")
    process.exit(1)
  }
  const npmrc = fs.createWriteStream("/root/.npmrc")
  npmrc.write(`//registry.npmjs.org/:_authToken=${token}`)
  npmrc.close()

  const path = params.path
  if(!path) {
    console.error("Please set `params.path`.")
    process.exit(1)
  }
  var cmdLine = "npm publish"
  const access = params.access
  if(access && ["public", "restricted"].indexOf(access) == -1) {
    console.error("Specified access ("+access+") is neither `public` nor `restricted`.")
    process.exit(1)
  } else if(access)
    cmdLine += ` --access ${access}`
  const cwd = `${process.argv[2]}/${path}`
  exec(cmdLine, {cwd: cwd}, (err, stdout, stderr) => {
    if(err) {
      console.error(err)
      process.exit(1)
    }
    const lines = stdout.split("\n").filter((v) => v)
    const line = lines[lines.length-1]
    const tokens = line.split("@")
    if(tokens.length > 1) {
      const version = tokens[tokens.length-1]
      if(version) {
        console.log(JSON.stringify({version: {number: version}}))
        process.exit(0)
      } else {
        console.error("Didn't get a version.", lines, line)
        process.exit(1)
      }
    } else {
      console.error('Don't know what this output means: ${stdout.toString()}`)
      process.exit(1)
    }
  })
})
