const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(
  path.join(__dirname, '../sound-effects/instrument-language-synth-mention-preview.html'),
  'utf8'
);

const requiredAssets = [
  '../assets/audio/character-voices/xiaomu.mp3',
  '../assets/audio/character-voices/amy.mp3',
  '../assets/audio/character-voices/fuluofu.mp3',
];

for (const asset of requiredAssets) {
  assert.match(
    html,
    new RegExp(asset.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    `preview page should reference ${asset}`
  );
  const abs = path.join(__dirname, '..', asset.replace(/^\.\.\//, ''));
  assert.ok(fs.existsSync(abs), `asset file missing: ${asset}`);
}

assert.match(html, /event\.type === 'characterAudio'/, 'playback loop should handle characterAudio events');
assert.match(html, /if \(audioEvent\) \{\s*events\.push\(audioEvent\);\s*charIndexOffset \+= \(segment\.raw \|\| segment\.text \|\| ''\)\.length;\s*continue;\s*\}/s, 'textToNotes should skip placeholder motif when real character audio exists');
console.log('mention-character-audio tests passed');
