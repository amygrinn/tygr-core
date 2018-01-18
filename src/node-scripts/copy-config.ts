#!/usr/bin/env node
import * as path from 'path';
import * as fs from 'fs';

const arg = process.argv[2];

console.error("CWD: " + process.cwd());

const packageConfigPath = path.join(process.cwd(), arg);
const configName = arg.split('/').slice(-1)[0];
const localConfigPath = path.join(process.cwd(), '../../../configs');

if (!fs.existsSync(localConfigPath)) {
  fs.mkdirSync(localConfigPath);
}

if (!fs.existsSync(path.join(localConfigPath, configName))) {
  fs.copyFileSync(packageConfigPath, path.join(localConfigPath, configName));
}
