#!/usr/bin/env node
import * as path from 'path';
import * as fs from 'fs';

const arg = process.argv[2];

const packageConfigPath = path.join(process.cwd(), arg);
const configName = arg.split('/').slice(-1)[0];
const localConfigPath = path.join(process.cwd(), '../../../configs', configName);

if (fs.existsSync(localConfigPath)) {
  fs.copyFileSync(localConfigPath, packageConfigPath);
}