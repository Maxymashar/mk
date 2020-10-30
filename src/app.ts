#!/usr/bin/env node

import { existsSync, mkdirSync, writeFileSync } from "fs";
import { resolve } from "path";
import { program } from "commander";

const { version, description } = require("./../package.json");

program.version(version);
program.description(description);

program
  .option("-f, --file <path-to-file>", "A file")
  .option("-d,--directory <path-to-directory>", "A directory");

program.parse(process.argv);

const { file, directory } = program;
main(file, directory);

function main(f: string, d: string): void {
  // check for both -f,-d
  if (f && d) {
    console.log("Please choose between -f and -d");
    return;
  }

  const path = f ? f : d;
  if (path) {
    const fullPath = resolve(process.cwd(), path);
    console.log(fullPath);
    if (existsSync(fullPath)) {
      console.log(`The path ${fullPath} already exist`);
      return;
    }
    const pathNames = path.split("/");
    let currentWorkingDir = process.cwd();
    for (let i = 0; i < pathNames.length; i++) {
      const pathName = pathNames[i];
      currentWorkingDir = resolve(currentWorkingDir, pathName);
      if (i === pathNames.length - 1) {
        if (f) {
          if (!existsSync(currentWorkingDir)) {
            writeFileSync(currentWorkingDir, "");
          }
        } else {
          if (!existsSync(currentWorkingDir)) {
            mkdirSync(currentWorkingDir);
          }
        }
      } else {
        if (!existsSync(currentWorkingDir)) {
          mkdirSync(currentWorkingDir);
        }
      }
    }
  }
}
