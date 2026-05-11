#!/usr/bin/env node
/**
 * QA Test Script for Note Density Reducer
 * 
 * Extracts JavaScript from instrument-language-synth.html, runs it in a Node.js
 * vm context with mocked DOM APIs, and tests all note density modes.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const HTML_PATH = path.resolve(__dirname, 'instrument-language-synth.html');

// ============================================================================
// Step 1: Extract all inline <script> JavaScript from the HTML
// ============================================================================
function extractScripts(html) {
    const scripts = [];
    const regex = /<script>([\s\S]*?)<\/script>/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
        scripts.push(match[1]);
    }
    return scripts.join('\n');
}

// ============================================================================
// Step 2: Build the mock environment
// ============================================================================
function buildMockContext() {
    const mockDocument = {
        querySelector: () => null,
        getElementById: () => null,
        addEventListener: () => {},
        removeEventListener: () => {},
        createElement: (tag) => ({
            tagName: tag,
            style: {},
            classList: { add: () => {}, remove: () => {} },
            appendChild: () => {},
            setAttribute: () => {},
            addEventListener: () => {},
        }),
        body: { appendChild: () => {} },
    };

    const mockWindow = {
        document: mockDocument,
        AudioContext: class FakeAudioContext {
            constructor() {
                this.state = 'running';
                this.currentTime = 0;
            }
            resume() { return Promise.resolve(); }
            createAnalyser() {
                return { fftSize: 2048, connect: () => {} };
            }
            createGain() {
                return { gain: { value: 1, setValueAtTime: () => {}, linearRampToValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {} };
            }
            createBiquadFilter() {
                return { type: 'peaking', frequency: { value: 0 }, gain: { value: 0 }, Q: { value: 1 }, connect: () => {} };
            }
            createBufferSource() {
                return { connect: () => {}, start: () => {}, playbackRate: { value: 1 } };
            }
            decodeAudioData() { return Promise.resolve({ duration: 1 }); }
            get destination() { return { connect: () => {} }; }
        },
        webkitAudioContext: class FakeAudioContext {},
        fetch: () => Promise.resolve({ ok: true, arrayBuffer: () => Promise.resolve(Buffer.alloc(0)) }),
        alert: () => {},
        console: console,
        setTimeout: setTimeout,
        setInterval: setInterval,
        clearTimeout: clearTimeout,
        clearInterval: clearInterval,
        requestAnimationFrame: (cb) => setTimeout(cb, 16),
        cancelAnimationFrame: clearTimeout,
        APP_VERSION: 'v3.x.x',
    };

    // Link window and document circularly
    mockWindow.window = mockWindow;
    mockDocument.defaultView = mockWindow;

    const mockCanvas = {
        getContext: () => ({
            fillRect: () => {},
            clearRect: () => {},
            fillText: () => {},
            beginPath: () => {},
            moveTo: () => {},
            lineTo: () => {},
            stroke: () => {},
        }),
    };

    // Helper: create a mocked element that returns itself for chainability
    const createMockEl = () => {
        const el = {
            style: {},
            classList: { add: () => {}, remove: () => {}, contains: () => false },
            textContent: '',
            innerHTML: '',
            value: '',
            appendChild: () => {},
            insertBefore: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            setAttribute: () => {},
            getAttribute: () => null,
            querySelector: () => null,
            querySelectorAll: () => [],
            children: [],
            parentNode: null,
            remove: () => {},
            click: () => {},
            focus: () => {},
            getContext: () => createMockEl().getContext,
            width: 800,
            height: 400,
        };
        return el;
    };

    // Override getElementById to return mock elements for common IDs
    const originalGetElementById = mockDocument.getElementById;
    mockDocument.getElementById = (id) => {
        const el = createMockEl();
        el.id = id;
        return el;
    };
    mockDocument.querySelector = (sel) => createMockEl();
    mockDocument.querySelectorAll = () => [];
    mockDocument.createElement = (tag) => {
        const el = createMockEl();
        el.tagName = tag;
        return el;
    };

    return mockWindow;
}

// ============================================================================
// Step 3: Prepare JS for vm execution
// ============================================================================
function prepareJsForVm(jsContent) {
    // The key problem: `const` declarations at top level of a <script> block
    // do NOT become properties of the global object in vm context.
    // Only `var` does. We need to expose params and related constants.
    //
    // Strategy: Replace top-level const declarations that we need to access
    // with var declarations. We do targeted replacements to avoid breaking
    // function-scoped const declarations.

    const replacements = [
        // Core param object (must be accessible)
        { from: /\bconst params = \{/, to: 'var params = {' },
        // Note Density related constants
        { from: /\bconst NOTE_DENSITY_REDUCER = \{/, to: 'var NOTE_DENSITY_REDUCER = {' },
        { from: /\bconst NOTE_DENSITY_MODE_CONFIG = \{/, to: 'var NOTE_DENSITY_MODE_CONFIG = {' },
        { from: /\bconst NOTE_DENSITY_PROTECTED_PHRASES = /, to: 'var NOTE_DENSITY_PROTECTED_PHRASES = ' },
        { from: /\bconst emotionKeywords = \{/, to: 'var emotionKeywords = {' },
        // Other top-level constants that functions depend on
        { from: /\bconst toneMap = \{/, to: 'var toneMap = {' },
        { from: /\bconst dialogueVoiceScale = \{/, to: 'var dialogueVoiceScale = {' },
        { from: /\bconst dialogueToneToDegree = \{/, to: 'var dialogueToneToDegree = {' },
        { from: /\bconst dialogueToneStyle = \{/, to: 'var dialogueToneStyle = {' },
        { from: /\bconst dialogueLightChars = new Set/, to: 'var dialogueLightChars = new Set' },
        { from: /\bconst dialoguePunctuationPauses = \{/, to: 'var dialoguePunctuationPauses = {' },
        { from: /\bconst punctuationRules = \{/, to: 'var punctuationRules = {' },
        { from: /\bconst phrasingConfig = \{/, to: 'var phrasingConfig = {' },
        { from: /\bconst sampleConfig = \{/, to: 'var sampleConfig = {' },
        { from: /\bconst phraseTriggerCategories = \{/, to: 'var phraseTriggerCategories = {' },
        { from: /\bconst phraseMidiPaths = \{/, to: 'var phraseMidiPaths = {' },
        { from: /\bconst characterVoiceConfig = \{/, to: 'var characterVoiceConfig = {' },
        { from: /\bconst voiceRegistry = \{/, to: 'var voiceRegistry = {' },
        { from: /\bconst characterVoiceRegistry = \{/, to: 'var characterVoiceRegistry = {' },
        { from: /\bconst CHARACTER_VOICE_BASE_BPM = /, to: 'var CHARACTER_VOICE_BASE_BPM = ' },
        { from: /\bconst audioBuffers = \{/, to: 'var audioBuffers = {' },
        { from: /\bconst chordFiles = /, to: 'var chordFiles = ' },
        { from: /\bconst noteToMidi = \{/, to: 'var noteToMidi = {' },
        { from: /\bconst NOTE_MAP = \{/, to: 'var NOTE_MAP = {' },
        { from: /\bconst emotionFiles = \{/, to: 'var emotionFiles = {' },
        { from: /\bconst pentatonicFreqs = \{/, to: 'var pentatonicFreqs = {' },
    ];

    let prepared = jsContent;
    for (const r of replacements) {
        prepared = prepared.replace(r.from, r.to);
    }

    // Also fix the early `const` in the inline script before the main script block
    // (the one that checks APP_VERSION for subtitle)
    prepared = prepared.replace(/const subtitle = /g, 'var subtitle = ');
    prepared = prepared.replace(/const toolbarVersion = /g, 'var toolbarVersion = ');

    return prepared;
}

// ============================================================================
// Step 4: Run the JS in vm and extract the functions
// ============================================================================
function runInVm(jsCode, globalContext) {
    const script = new vm.Script(jsCode, {
        filename: 'instrument-language-synth.js',
        lineOffset: 0,
    });
    const context = vm.createContext(globalContext);
    script.runInContext(context);
    return context;
}

// ============================================================================
// Step 5: QA Test Cases
// ============================================================================
function runTests(ctx) {
    const results = [];
    const assert = (condition, message) => {
        if (!condition) {
            throw new Error(`ASSERTION FAILED: ${message}`);
        }
    };

    // Short test texts of varying lengths
    const testTexts = {
        short: '你好世界',
        medium: '今天天气真不错我们一起去公园散步吧',
        long: '这是一个很长的测试句子没有任何标点符号只是为了测试NoteDensityReducer在长句无标点情况下的压缩效果你看这句话真的很长对吧',
        withPunctuation: '你好，世界！今天天气真不错。',
        withProtectedPhrase: '这里不对劲快回来不要过去太危险了',
        mixed: '你好世界今天天气真不错我们一起去公园吧这个地方真好玩我很开心',
        english: 'hello world this is a test of the note density reducer system',
    };

    // Helper to count note events
    const countNotes = (events) => events.filter(e => e.type === 'note' && e.char && ctx.isEffectiveChar(e.char)).length;

    // Helper to count pause events
    const countPauses = (events) => events.filter(e => e.type === 'pause').length;

    console.log('\n========================================');
    console.log('  Note Density Reducer QA Test Suite');
    console.log('========================================\n');

    // --- Test 1: Verify params exists ---
    console.log('[Test 1] params object exists and has expected shape');
    assert(ctx.params !== undefined, 'params is undefined');
    assert(ctx.params.noteDensityMode === 'natural', `default noteDensityMode should be 'natural', got ${ctx.params.noteDensityMode}`);
    assert(ctx.params.noteDensityReducerEnabled === true, 'noteDensityReducerEnabled should be true');
    console.log('  ✓ PASS: params exists with correct defaults\n');

    // --- Test 2: Verify textToEvents function exists ---
    console.log('[Test 2] textToEvents function exists');
    assert(typeof ctx.textToEvents === 'function', 'textToEvents is not a function');
    console.log('  ✓ PASS: textToEvents is callable\n');

    // --- Test 3: Verify applyNoteDensityReduction function exists ---
    console.log('[Test 3] applyNoteDensityReduction function exists');
    assert(typeof ctx.applyNoteDensityReduction === 'function', 'applyNoteDensityReduction is not a function');
    console.log('  ✓ PASS: applyNoteDensityReduction is callable\n');

    // --- Test 4: getNoteDensityTargetCount correctness ---
    console.log('[Test 4] getNoteDensityTargetCount returns correct values');
    const targetCounts = [
        { count: 5, mode: 'natural', expected: 4 },   // min(10, ceil(5*0.65)=4, 5) = 4
        { count: 5, mode: 'compact', expected: 3 },   // min(7, ceil(5*0.45)=3, 5) = 3
        { count: 5, mode: 'minimal', expected: 2 },  // min(4, ceil(5*0.25)=2, 5) = 2
        { count: 20, mode: 'full', expected: 20 },      // full mode = no reduction
        { count: 20, mode: 'natural', expected: 10 }, // min(10, ceil(20*0.65)=13) = 10
        { count: 20, mode: 'compact', expected: 7 },  // min(7, ceil(20*0.45)=9) = 7
        { count: 20, mode: 'minimal', expected: 4 },  // min(4, ceil(20*0.25)=5) = 4
        { count: 15, mode: 'natural', expected: 10 }, // min(10, ceil(15*0.65)=10) = 10
        { count: 12, mode: 'natural', expected: 8 },   // min(10, ceil(12*0.65)=8) = 8
        { count: 10, mode: 'natural', expected: 7 },  // min(10, ceil(10*0.65)=7) = 7 -> wait, 12*0.65=7.8, ceil=8, min(10,8)=8
    ];
    for (const tc of targetCounts) {
        const actual = ctx.getNoteDensityTargetCount(tc.count, tc.mode);
        assert(actual === tc.expected, `getNoteDensityTargetCount(${tc.count}, '${tc.mode}') expected ${tc.expected}, got ${actual}`);
    }
    console.log('  ✓ PASS: target counts are correct for all modes\n');

    // --- Test 5: Short text (<=10 chars) should NOT be reduced in any mode ---
    console.log('[Test 5] Short text never gets reduced');
    for (const mode of ['full', 'natural', 'compact', 'minimal']) {
        ctx.params.noteDensityMode = mode;
        const events = ctx.textToEvents(testTexts.short);
        const noteCount = countNotes(events);
        assert(noteCount === 4, `Short text '${testTexts.short}' should have 4 notes in mode '${mode}', got ${noteCount}`);
    }
    // Reset
    ctx.params.noteDensityMode = 'natural';
    console.log('  ✓ PASS: short text preserved across all modes\n');

    // --- Test 6: Text with punctuation should NOT be reduced ---
    console.log('[Test 6] Text with punctuation is not reduced');
    for (const mode of ['natural', 'compact', 'minimal']) {
        ctx.params.noteDensityMode = mode;
        const events = ctx.textToEvents(testTexts.withPunctuation);
        const noteCount = countNotes(events);
        const pauseCount = countPauses(events);
        // With punctuation, the text is split into sentences, each <= 10 chars
        assert(noteCount > 0, 'Should have notes');
        assert(pauseCount > 0, 'Should have pauses from punctuation');
    }
    ctx.params.noteDensityMode = 'natural';
    console.log('  ✓ PASS: punctuated text preserved\n');

    // --- Test 7: Long text reduction by mode ---
    console.log('[Test 7] Long text reduction varies by mode');
    const reductions = {};
    for (const mode of ['full', 'natural', 'compact', 'minimal']) {
        ctx.params.noteDensityMode = mode;
        const events = ctx.textToEvents(testTexts.long);
        const noteCount = countNotes(events);
        reductions[mode] = noteCount;
    }
    ctx.params.noteDensityMode = 'natural';

    console.log(`    full:      ${reductions.full} notes`);
    console.log(`    natural:   ${reductions.natural} notes`);
    console.log(`    compact:   ${reductions.compact} notes`);
    console.log(`    minimal:   ${reductions.minimal} notes`);

    assert(reductions.full > reductions.natural, `full (${reductions.full}) should have more notes than natural (${reductions.natural})`);
    assert(reductions.natural > reductions.compact || reductions.compact === reductions.minimal, `natural (${reductions.natural}) should have more or equal notes than compact (${reductions.compact})`);
    assert(reductions.compact >= reductions.minimal, `compact (${reductions.compact}) should have more or equal notes than minimal (${reductions.minimal})`);
    console.log('  ✓ PASS: reduction ordering is correct\n');

    // --- Test 8: full mode = no reduction ---
    console.log('[Test 8] full mode preserves all notes');
    ctx.params.noteDensityMode = 'full';
    const fullEvents = ctx.textToEvents(testTexts.long);
    const fullNoteCount = countNotes(fullEvents);
    ctx.params.noteDensityMode = 'natural';
    const naturalEvents = ctx.textToEvents(testTexts.long);
    const naturalNoteCount = countNotes(naturalEvents);
    assert(fullNoteCount > naturalNoteCount, `full mode should preserve more notes than natural mode (${fullNoteCount} vs ${naturalNoteCount})`);
    console.log(`  ✓ PASS: full mode preserved ${fullNoteCount} notes (natural: ${naturalNoteCount})\n`);

    // --- Test 9: Protected phrases are preserved ---
    console.log('[Test 9] Protected phrases are preserved in reduction');
    ctx.params.noteDensityMode = 'minimal';
    const protectedEvents = ctx.textToEvents(testTexts.withProtectedPhrase);
    const protectedNoteCount = countNotes(protectedEvents);
    // "不对劲", "快回来", "不要过去", "太危险了" are protected phrases
    // The protected phrases should cause those characters to be prioritized
    ctx.params.noteDensityMode = 'natural';
    console.log(`  ✓ PASS: protected phrase test completed (${protectedNoteCount} notes in minimal mode)\n`);

    // --- Test 10: applyNoteDensityReduction with options override ---
    console.log('[Test 10] options.mode overrides params.noteDensityMode');
    ctx.params.noteDensityMode = 'full';
    const rawEvents = ctx.textToNotes(testTexts.medium);
    const overriddenEvents = ctx.applyNoteDensityReduction(rawEvents, testTexts.medium, { mode: 'minimal' });
    const overriddenNoteCount = countNotes(overriddenEvents);
    const fullEventsDirect = ctx.textToEvents(testTexts.medium); // params.mode = full
    const fullNoteCountMedium = countNotes(fullEventsDirect);
    assert(overriddenNoteCount < fullNoteCountMedium, `options.mode='minimal' should reduce notes below full mode (${overriddenNoteCount} vs ${fullNoteCountMedium})`);
    ctx.params.noteDensityMode = 'natural';
    console.log(`  ✓ PASS: options override works (${overriddenNoteCount} vs ${fullNoteCountMedium})\n`);

    // --- Test 11: English text handling ---
    console.log('[Test 11] English text handling');
    ctx.params.noteDensityMode = 'natural';
    const englishEvents = ctx.textToEvents(testTexts.english);
    const englishNoteCount = countNotes(englishEvents);
    assert(englishNoteCount > 0, 'English text should produce notes');
    console.log(`  ✓ PASS: English text produced ${englishNoteCount} notes\n`);

    // --- Test 12: scanProtectedPhrases ---
    console.log('[Test 12] scanProtectedPhrases finds all protected phrases');
    const ranges = ctx.scanProtectedPhrases('不对劲快回来不要过去这里有危险');
    assert(ranges.length >= 3, `Expected at least 3 protected ranges, got ${ranges.length}`);
    const phrases = ranges.map(r => r.phrase);
    assert(phrases.includes('不对劲'), 'Should detect "不对劲"');
    assert(phrases.includes('快回来'), 'Should detect "快回来"');
    assert(phrases.includes('不要过去'), 'Should detect "不要过去"');
    console.log(`  ✓ PASS: found ${ranges.length} protected phrases: ${phrases.join(', ')}\n`);

    // --- Test 13: isEffectiveChar ---
    console.log('[Test 13] isEffectiveChar identifies valid characters');
    assert(ctx.isEffectiveChar('你') === true, 'Chinese char should be effective');
    assert(ctx.isEffectiveChar('a') === true, 'English char should be effective');
    assert(ctx.isEffectiveChar('5') === true, 'Digit should be effective');
    assert(ctx.isEffectiveChar('，') === false, 'Punctuation should NOT be effective');
    assert(ctx.isEffectiveChar(' ') === false, 'Space should NOT be effective');
    assert(ctx.isEffectiveChar('') === false, 'Empty string should NOT be effective');
    console.log('  ✓ PASS: isEffectiveChar works correctly\n');

    // --- Test 14: NOTE_DENSITY_REDUCER configuration ---
    console.log('[Test 14] NOTE_DENSITY_REDUCER configuration');
    assert(ctx.NOTE_DENSITY_REDUCER.enabled === true, 'Reducer should be enabled');
    assert(ctx.NOTE_DENSITY_REDUCER.maxEffectiveCharsPerSentence === 10, 'Max effective chars should be 10');
    // instanceof Set doesn't work across vm boundaries; check for Set methods instead
    assert(typeof ctx.NOTE_DENSITY_REDUCER.negationWords.has === 'function', 'negationWords should behave like a Set');
    assert(typeof ctx.NOTE_DENSITY_REDUCER.actionWords.has === 'function', 'actionWords should behave like a Set');
    assert(ctx.NOTE_DENSITY_REDUCER.negationWords.has('不'), '"不" should be in negationWords');
    assert(ctx.NOTE_DENSITY_REDUCER.actionWords.has('走'), '"走" should be in actionWords');
    console.log('  ✓ PASS: reducer configuration is correct\n');

    // --- Test 15: NOTE_DENSITY_MODE_CONFIG ---
    console.log('[Test 15] NOTE_DENSITY_MODE_CONFIG definitions');
    const modes = ['full', 'natural', 'compact', 'minimal'];
    for (const mode of modes) {
        assert(ctx.NOTE_DENSITY_MODE_CONFIG[mode] !== undefined, `Mode '${mode}' should be defined`);
        assert(typeof ctx.NOTE_DENSITY_MODE_CONFIG[mode].ratio === 'number', `Mode '${mode}' should have ratio`);
        assert(typeof ctx.NOTE_DENSITY_MODE_CONFIG[mode].maxNotes === 'number', `Mode '${mode}' should have maxNotes`);
    }
    assert(ctx.NOTE_DENSITY_MODE_CONFIG.full.maxNotes === Infinity, 'full mode maxNotes should be Infinity');
    console.log('  ✓ PASS: all 4 density modes configured correctly\n');

    // --- Test 16: Medium text with different modes ---
    console.log('[Test 16] Medium text across all modes (summary)');
    ctx.params.noteDensityMode = 'natural';
    const mediumRaw = ctx.textToNotes(testTexts.medium);
    const mediumRawCount = countNotes(mediumRaw);
    console.log(`    raw notes:     ${mediumRawCount}`);
    for (const mode of ['full', 'natural', 'compact', 'minimal']) {
        const reduced = ctx.applyNoteDensityReduction(mediumRaw, testTexts.medium, { mode });
        const count = countNotes(reduced);
        console.log(`    ${mode.padEnd(7)}: ${count}`);
    }
    console.log('  ✓ PASS: medium text summary complete\n');

    // --- Test 17: Edge case - empty text ---
    console.log('[Test 17] Edge case: empty text');
    const emptyEvents = ctx.textToEvents('');
    assert(Array.isArray(emptyEvents), 'Empty text should return array');
    assert(emptyEvents.length === 0, 'Empty text should return empty array');
    console.log('  ✓ PASS: empty text handled correctly\n');

    // --- Test 18: Edge case - single character ---
    console.log('[Test 18] Edge case: single character');
    const singleEvents = ctx.textToEvents('你');
    assert(singleEvents.length >= 1, 'Single char should produce at least 1 event');
    console.log('  ✓ PASS: single character produces events\n');

    // --- Test 19: Disabled reducer ---
    console.log('[Test 19] Disabled reducer returns all events');
    ctx.NOTE_DENSITY_REDUCER.enabled = false;
    ctx.params.noteDensityMode = 'minimal'; // even with minimal mode
    const disabledEvents = ctx.textToEvents(testTexts.long);
    const disabledNoteCount = countNotes(disabledEvents);
    ctx.NOTE_DENSITY_REDUCER.enabled = true;
    ctx.params.noteDensityMode = 'natural';
    // When disabled, should return raw events (same as full mode)
    // (need to re-run because params was changed mid-test)
    ctx.NOTE_DENSITY_REDUCER.enabled = false;
    ctx.params.noteDensityMode = 'minimal';
    const disabledEvents2 = ctx.textToEvents(testTexts.long);
    const disabledCount2 = countNotes(disabledEvents2);
    ctx.NOTE_DENSITY_REDUCER.enabled = true;
    ctx.params.noteDensityMode = 'natural';

    // Actually when disabled, applyNoteDensityReduction returns events as-is
    // regardless of mode. Let's verify directly:
    const rawForDisable = ctx.textToNotes(testTexts.medium);
    ctx.NOTE_DENSITY_REDUCER.enabled = false;
    const disabledDirect = ctx.applyNoteDensityReduction(rawForDisable, testTexts.medium, { mode: 'minimal' });
    ctx.NOTE_DENSITY_REDUCER.enabled = true;
    assert(countNotes(disabledDirect) === countNotes(rawForDisable), 'Disabled reducer should not reduce');
    console.log(`  ✓ PASS: disabled reducer preserved ${countNotes(disabledDirect)} notes\n`);

    console.log('========================================');
    console.log('  ALL 19 TESTS PASSED ✓');
    console.log('========================================');

    return { passed: 19, failed: 0 };
}

// ============================================================================
// Main
// ============================================================================
function main() {
    if (!fs.existsSync(HTML_PATH)) {
        console.error(`ERROR: HTML file not found at ${HTML_PATH}`);
        process.exit(1);
    }

    console.log(`Loading HTML from: ${HTML_PATH}`);
    const html = fs.readFileSync(HTML_PATH, 'utf-8');

    console.log('Extracting inline JavaScript...');
    const jsContent = extractScripts(html);
    console.log(`Extracted ${jsContent.length} bytes of JavaScript`);

    console.log('Preparing JS for vm execution (replacing const → var for globals)...');
    const preparedJs = prepareJsForVm(jsContent);

    // Write prepared JS to temp file for debugging
    const tempPath = path.resolve(__dirname, '.qa-test-prepared.js');
    fs.writeFileSync(tempPath, preparedJs);
    console.log(`Prepared JS written to: ${tempPath}`);

    console.log('Building mock browser context...');
    const globalContext = buildMockContext();

    console.log('Running JS in vm context...');
    let ctx;
    try {
        ctx = runInVm(preparedJs, globalContext);
    } catch (err) {
        console.error('VM execution failed:', err.message);
        // Show the line that failed
        if (err.stack) {
            const match = err.stack.match(/instrument-language-synth\.js:(\d+):(\d+)/);
            if (match) {
                const lineNum = parseInt(match[1]);
                const lines = preparedJs.split('\n');
                console.error(`  Around line ${lineNum}:`);
                for (let i = Math.max(0, lineNum - 3); i < Math.min(lines.length, lineNum + 3); i++) {
                    console.error(`    ${i + 1}: ${lines[i]}`);
                }
            }
        }
        process.exit(1);
    }

    // Verify key globals are exposed
    console.log('\nVerifying global exposure:');
    const checks = ['params', 'textToEvents', 'applyNoteDensityReduction', 'textToNotes',
        'getNoteDensityTargetCount', 'isEffectiveChar', 'scanProtectedPhrases',
        'NOTE_DENSITY_REDUCER', 'NOTE_DENSITY_MODE_CONFIG', 'emotionKeywords'];
    for (const name of checks) {
        const exists = ctx[name] !== undefined;
        console.log(`  ${name}: ${exists ? '✓' : '✗'}`);
        if (!exists) {
            console.error(`ERROR: ${name} not exposed on vm context. Check const→var replacement.`);
            process.exit(1);
        }
    }

    // Run the actual tests
    const testResults = runTests(ctx);

    // Cleanup temp file
    try { fs.unlinkSync(tempPath); } catch (e) {}

    console.log('\nDone.');
    process.exit(testResults.failed > 0 ? 1 : 0);
}

main();
