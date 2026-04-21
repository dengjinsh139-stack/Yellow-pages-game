const assert = require('node:assert/strict');
const {
  splitTextWithMentions,
  convertMentionProfileToEvents,
} = require('../sound-effects/mention-motif-core.js');

function testSplitTextWithMentions() {
  const config = {
    enabled: true,
    mentionPrefix: '@',
    characterProfiles: {
      小牧: {
        aliases: ['小牧'],
        instrument: 'piano',
        motifNotes: [
          { note: 'D5', durationMs: 180, velocity: 0.85 },
          { note: 'A4', durationMs: 160, velocity: 0.75 },
        ],
      },
    },
  };

  const segments = splitTextWithMentions('你好@小牧今天好吗', config);
  assert.equal(segments.length, 3);
  assert.deepEqual(segments.map(s => s.type), ['text', 'mention', 'text']);
  assert.equal(segments[1].character, '小牧');
}

function testConvertMentionProfileToEvents() {
  const profile = {
    instrument: 'piano',
    insertPauseBeforeMs: 80,
    insertPauseAfterMs: 120,
    motifNotes: [
      { note: 'D5', durationMs: 180, velocity: 0.8 },
      { note: 'A4', durationMs: 160, velocity: 0.7, pauseMs: 40 },
    ],
  };

  const events = convertMentionProfileToEvents('小牧', profile, {
    noteNameToFrequency: {
      D5: 587.33,
      A4: 440.0,
    },
  });

  assert.equal(events[0].type, 'pause');
  assert.equal(events[1].type, 'note');
  assert.equal(events[1].instrumentOverride, 'piano');
  assert.equal(events[1].isMentionMotif, true);
  assert.equal(events[1].motifCharacter, '小牧');
  assert.equal(events.at(-1).type, 'pause');
}

function run() {
  testSplitTextWithMentions();
  testConvertMentionProfileToEvents();
  console.log('mention-motif-core tests passed');
}

run();
