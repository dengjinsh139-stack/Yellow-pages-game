const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(
  path.join(__dirname, '../sound-effects/instrument-language-synth.html'),
  'utf8'
);

function expectProfile(name, instrument) {
  const blockPattern = new RegExp(
    `'${name}'\\s*:\\s*\\{[\\s\\S]*?instrument:\\s*'${instrument}'`,
    'm'
  );
  assert.match(html, blockPattern, `${name} should default to ${instrument}`);
}

function run() {
  expectProfile('小牧', 'xylophone');
  expectProfile('艾米', 'piano');
  expectProfile('芙洛芙', 'flute');
  console.log('mention-motif-config tests passed');
}

run();
