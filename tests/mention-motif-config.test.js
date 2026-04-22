const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const pages = [
  '../sound-effects/instrument-language-synth.html',
  '../sound-effects/instrument-language-synth-mention-preview.html',
].map(relPath => ({
  relPath,
  html: fs.readFileSync(path.join(__dirname, relPath), 'utf8'),
}));

function expectProfile(page, name, instrument) {
  const blockPattern = new RegExp(
    `'${name}'\\s*:\\s*\\{[\\s\\S]*?instrument:\\s*'${instrument}'`,
    'm'
  );
  assert.match(page.html, blockPattern, `${page.relPath}: ${name} should default to ${instrument}`);
}

function run() {
  for (const page of pages) {
    expectProfile(page, '小牧', 'xylophone');
    expectProfile(page, '艾米', 'piano');
    expectProfile(page, '芙洛芙', 'flute');
  }
  console.log('mention-motif-config tests passed');
}

run();
