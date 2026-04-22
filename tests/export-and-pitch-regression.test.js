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

for (const page of pages) {
  assert.doesNotMatch(page.html, /'G4'|'G5'/, `${page.relPath}: should not contain G4/G5 in fixed 10-note logic`);
  assert.doesNotMatch(page.html, /\['D', 'E', 'G', 'A', 'B'\]/, `${page.relPath}: should not use legacy D E G A B note set`);
  assert.doesNotMatch(page.html, /\[62, 64, 67, 69, 71, 74, 76, 79, 81, 83\]/, `${page.relPath}: should not map MIDI through G-based note set`);
}

const preview = pages.find(page => page.relPath.includes('mention-preview'));
assert.match(preview.html, /event\.type === 'characterAudio'/, 'preview page playback/export should handle characterAudio events');
assert.match(preview.html, /evt\.type === 'characterAudio'/, 'preview page timing logic should recognize characterAudio events');
assert.match(preview.html, /renderCharacterAudioToBuffer/, 'preview page should render character audio into offline export');

console.log('export-and-pitch-regression tests passed');
