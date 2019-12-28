#!/usr/bin/env node
"use strict";

const fs = require("fs").promises;
const path = require("path");
const pkg = require("../package.json");

const fileName = path.join(__dirname, "..", pkg.main);

function cleanup(css) {
  return css
    // Perfectionist adds comments to the end of the previous line...
    // }/* comment */ => }\n\n  /* comment */
    .replace(/}\/\*(([\s\S])+?)\*\/\s*/g, "}\n\n  /*$1*/\n  ")
    .replace(/,\s\/\*/g, ",\n  /*")
    .replace(/\s+regexp\(/g, "\nregexp(")
    // Remove extra carriage returns between definitions
    .replace(/\n+/g, "\n");
}

async function postPerfectionist() {
  const css = await fs.readFile(fileName, "utf8");
  await fs.writeFile(fileName, cleanup(css));
  console.info("\x1b[32m%s\x1b[0m", `${pkg.title} usercss cleanup completed`);
}

postPerfectionist();
