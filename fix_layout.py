with open('sound-effects/instrument-language-synth.html', 'r') as f:
    lines = f.readlines()

# Find all panel divs and their exact boundaries
panels = []
for i, line in enumerate(lines):
    stripped = line.strip()
    if stripped == '<div class="panel">':
        panels.append({'start': i+1, 'end': None, 'nesting': 1})

# Now trace each panel
for idx, p in enumerate(panels):
    start_idx = p['start'] - 1
    nesting = 1
    for j in range(start_idx + 1, len(lines)):
        js = lines[j].strip()
        # Count <div and </div> more carefully
        # Only count at the START of the stripped line
        if js.startswith('<div') and not js.startswith('</div>'):
            nesting += 1
        elif js.startswith('</div>'):
            nesting -= 1
        
        if nesting == 0:
            p['end'] = j + 1
            break

for p in panels:
    if p['end']:
        print(f"Panel {panels.index(p)+1}: lines {p['start']}-{p['end']}")
        print(f"  Start: {lines[p['start']-1].strip()[:60]}")
        print(f"  End: {lines[p['end']-1].strip()[:60]}")
        print(f"  Next: {lines[p['end']].strip()[:60] if p['end'] < len(lines) else 'END'}")
    else:
        print(f"Panel {panels.index(p)+1}: lines {p['start']}-??? (NOT CLOSED)")
    print()
