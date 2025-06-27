#!/usr/bin/env node

const spawnAsync = require('@expo/spawn-async');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');

async function buildAsync() {
  console.log(`⚙️  Building web assets`);
  const packageRoot = path.join(ROOT);
  await Promise.all([
    fs.promises.rm(path.join(packageRoot, 'dist'), { recursive: true, force: true }),
    fs.promises.rm(path.join(packageRoot, 'webui', 'dist'), { recursive: true, force: true }),
  ]);
  await spawnAsync('npx', ['expo', 'export', '-p', 'web', '--output-dir', 'dist'], {
    cwd: path.join(packageRoot, 'webui'),
  });
  await fs.promises.rename(path.join(packageRoot, 'webui', 'dist'), path.join(packageRoot, 'dist'));
}

(async () => {
  try {
    await buildAsync();
  } catch (e) {
    console.error('Uncaught Error', e);
    process.exit(1);
  }
})();
