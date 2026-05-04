# Move character voice from panel 3 to bottom-section
# Keeps Voice Shaping + Effects + Export in panel 3

with open('sound-effects/instrument-language-synth.html', 'r') as f:
    lines = f.readlines()

print(f"Total lines: {len(lines)}")

new_lines = []

# Part 1: Everything before character voice comment (indices 0-1474 = file lines 1-1475)
new_lines.extend(lines[0:1475])
print(f"Part 1: lines 1-1475 ({len(lines[0:1475])} lines)")

# Part 2: Panel 3 close + workbench close + bottom comment
# indices 1518-1520 = file lines 1519-1521
new_lines.extend(lines[1518:1521])
print(f"Part 2: panel close + workbench close + comment ({len(lines[1518:1521])} lines)")

# Part 3: New bottom section with character voice + existing content
new_lines.append('        <div class="bottom-section">\n')
new_lines.append('            <div class="bottom-card">\n')
# Character voice content + comment (indices 1475-1516 = file lines 1476-1517)
new_lines.extend(lines[1475:1517])
print(f"Part 3a: character voice ({len(lines[1475:1517])} lines)")
# Existing bottom content (skip old bottom-section and bottom-card starts)
# Old bottom-section is at index 1521, old bottom-card at 1522
# Start from index 1523 (file line 1524)
new_lines.extend(lines[1523:])
print(f"Part 3b: existing bottom ({len(lines[1523:])} lines)")

# Verify div balance
opens = sum(line.count('<div') for line in new_lines)
closes = sum(line.count('</div>') for line in new_lines)
print(f"\nDiv balance: opens={opens}, closes={closes}, diff={opens - closes}")

# Write back
with open('sound-effects/instrument-language-synth.html', 'w') as f:
    f.writelines(new_lines)

print(f"\nWritten {len(new_lines)} lines")
print("Done!")
