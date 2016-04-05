#!/usr/bin/env node

process.stdin.on("data", (chunk) => {
  console.log("{}")
  process.exit(0)
})
