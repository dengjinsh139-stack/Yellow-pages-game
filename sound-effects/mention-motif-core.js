(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.MentionMotifCore = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function safeTrim(value) {
    return typeof value === 'string' ? value.trim() : '';
  }

  function getCharacterProfiles(config) {
    if (!config || config.enabled === false) return [];
    const profiles = config.characterProfiles || {};
    return Object.entries(profiles)
      .map(([name, profile]) => ({
        name,
        profile: profile || {},
      }))
      .filter(entry => entry.name);
  }

  function buildMentionMatchers(config) {
    const prefix = safeTrim(config?.mentionPrefix) || '@';
    const entries = [];

    for (const { name, profile } of getCharacterProfiles(config)) {
      const aliases = Array.isArray(profile.aliases) ? profile.aliases : [];
      const rawNames = [name, ...aliases]
        .map(safeTrim)
        .filter(Boolean);

      for (const rawName of new Set(rawNames)) {
        entries.push({
          type: 'prefixed',
          pattern: `${prefix}${rawName}`,
          character: name,
          profile,
        });
        entries.push({
          type: 'plain',
          pattern: rawName,
          character: name,
          profile,
        });
      }
    }

    return entries.sort((a, b) => b.pattern.length - a.pattern.length);
  }

  function splitTextWithMentions(text, config) {
    const source = typeof text === 'string' ? text : '';
    const matchers = buildMentionMatchers(config);
    if (!source || matchers.length === 0) {
      return source ? [{ type: 'text', text: source }] : [];
    }

    const segments = [];
    let i = 0;
    let buffer = '';

    while (i < source.length) {
      let matched = null;
      for (const matcher of matchers) {
        if (source.startsWith(matcher.pattern, i)) {
          matched = matcher;
          break;
        }
      }

      if (!matched) {
        buffer += source[i];
        i += 1;
        continue;
      }

      if (buffer) {
        segments.push({ type: 'text', text: buffer });
        buffer = '';
      }

      segments.push({
        type: 'mention',
        text: matched.pattern,
        raw: matched.pattern,
        character: matched.character,
        profile: matched.profile,
      });
      i += matched.pattern.length;
    }

    if (buffer) {
      segments.push({ type: 'text', text: buffer });
    }

    return segments;
  }

  function normalizeMotifNote(noteDef, profile, helpers) {
    if (!noteDef || !noteDef.note) return null;
    const noteNameToFrequency = helpers?.noteNameToFrequency || {};
    const note = noteDef.note;
    const frequency = typeof noteDef.frequency === 'number'
      ? noteDef.frequency
      : noteNameToFrequency[note];

    if (!frequency) return null;

    const durationMs = Math.max(1, noteDef.durationMs || noteDef.duration || 180);
    const velocity = typeof noteDef.velocity === 'number' ? noteDef.velocity : 0.75;

    const event = {
      type: 'note',
      char: profile?.label || profile?.name || '',
      note,
      sampleNote: note,
      frequency,
      duration: durationMs,
      velocity,
      tone: 1,
      region: [note],
      isMentionMotif: true,
      instrumentOverride: profile.instrument || null,
      motifCharacter: profile.name || null,
      durationMultiplier: 1,
    };

    return { event, pauseMs: noteDef.pauseMs || 0 };
  }

  function midiDataToMotifEvents(characterName, profile, helpers) {
    const midiData = profile?.parsedMidi || profile?.midiData;
    if (!midiData || !Array.isArray(midiData.tracks)) return [];

    const mapToPentatonic = helpers?.mapToPentatonic;
    const midiToFreq = helpers?.midiToFreq || {};
    const noteNumberToName = helpers?.noteNumberToName;
    const defaultVelocity = typeof profile.defaultVelocity === 'number' ? profile.defaultVelocity : 0.75;
    const defaultDurationMs = Math.max(1, profile.defaultDurationMs || 180);
    const msPerTick = profile.msPerTick || (midiData.timeDivision ? (60000 / (120 * midiData.timeDivision)) : null);

    if (!mapToPentatonic || !noteNumberToName || !msPerTick) return [];

    const allNotes = [];
    for (const track of midiData.tracks) {
      for (const event of track) {
        if (event && event.type === 'noteOn') {
          allNotes.push(event);
        }
      }
    }
    allNotes.sort((a, b) => a.time - b.time);

    const events = [];
    let lastTime = 0;
    for (const noteEvent of allNotes) {
      const waitMs = Math.max(0, Math.round((noteEvent.time - lastTime) * msPerTick));
      if (waitMs > 0) {
        events.push({ type: 'pause', pauseMs: waitMs, symbol: '♪', isMentionMotif: true, motifCharacter: characterName });
      }
      lastTime = noteEvent.time;

      const pentatonicMidi = mapToPentatonic(noteEvent.note);
      const noteName = noteNumberToName(pentatonicMidi);
      const frequency = midiToFreq[pentatonicMidi];
      if (!noteName || !frequency) continue;

      events.push({
        type: 'note',
        char: characterName,
        note: noteName,
        sampleNote: noteName,
        frequency,
        duration: defaultDurationMs,
        velocity: typeof noteEvent.velocity === 'number' ? (noteEvent.velocity / 127) : defaultVelocity,
        tone: 1,
        region: [noteName],
        isMentionMotif: true,
        instrumentOverride: profile.instrument || null,
        motifCharacter: characterName,
        durationMultiplier: 1,
      });
    }

    return events;
  }

  function convertMentionProfileToEvents(characterName, profile, helpers) {
    if (!profile) return [];
    const resolvedProfile = { ...profile, name: characterName };
    const events = [];
    const beforeMs = Math.max(0, resolvedProfile.insertPauseBeforeMs || 0);
    const afterMs = Math.max(0, resolvedProfile.insertPauseAfterMs || 0);

    if (beforeMs > 0) {
      events.push({ type: 'pause', pauseMs: beforeMs, symbol: '⌁', isMentionMotif: true, motifCharacter: characterName });
    }

    if (Array.isArray(resolvedProfile.motifNotes) && resolvedProfile.motifNotes.length > 0) {
      for (const noteDef of resolvedProfile.motifNotes) {
        const normalized = normalizeMotifNote(noteDef, resolvedProfile, helpers);
        if (!normalized) continue;
        events.push(normalized.event);
        if (normalized.pauseMs > 0) {
          events.push({ type: 'pause', pauseMs: normalized.pauseMs, symbol: '·', isMentionMotif: true, motifCharacter: characterName });
        }
      }
    } else {
      events.push(...midiDataToMotifEvents(characterName, resolvedProfile, helpers));
    }

    if (afterMs > 0) {
      events.push({ type: 'pause', pauseMs: afterMs, symbol: '⌁', isMentionMotif: true, motifCharacter: characterName });
    }

    return events;
  }

  return {
    buildMentionMatchers,
    splitTextWithMentions,
    convertMentionProfileToEvents,
    midiDataToMotifEvents,
  };
});
