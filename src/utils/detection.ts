export interface DetectionResult {
  zeroWidthChars: number;
  invisibleChars: number;
  homoglyphs: number;
  mixedScripts: number;
  suspiciousPunctuation: number;
  bidiMarks: number;
  nonBreakingSpaces: number;
  unusualWhitespace: number;
  controlChars: number;
  unmatchedBidi: number;
  zwjChains: number;
  repeatingInvisible: number;
  mixedDirectionality: number;
  encodedData: number;
  totalIssues: number;
  noiseScore: number;
  maxLineDensity: number;
  highlightedPositions: Array<{ start: number; end: number; type: string; char: string }>;
}

export interface HighlightInfo {
  start: number;
  end: number;
  type: 'invisible' | 'homoglyph' | 'punctuation' | 'space' | 'bidi';
  char: string;
  description: string;
}

// Zero-width and invisible characters
export const ZERO_WIDTH_CHARS = [
  '\u200B', // Zero Width Space
  '\u200C', // Zero Width Non-Joiner
  '\u200D', // Zero Width Joiner
  '\uFEFF', // Zero Width No-Break Space
  '\u2060', // Word Joiner
  '\u2062', // Invisible Times
  '\u2063', // Invisible Separator
  '\u2064', // Invisible Plus
];

// Invisible formatting characters (expanded with Tags, Variation Selectors)
export const INVISIBLE_CHARS = [
  '\u00AD', // Soft Hyphen
  '\u034F', // Combining Grapheme Joiner
  '\u061C', // Arabic Letter Mark
  '\u115F', // Hangul Choseong Filler
  '\u1160', // Hangul Jungseong Filler
  '\u17B4', // Khmer Vowel Inherent Aq
  '\u17B5', // Khmer Vowel Inherent Aa
  '\u180E', // Mongolian Vowel Separator
  '\u180B', '\u180C', '\u180D', // Mongolian Free Variation Selectors
  '\uFE00', '\uFE01', '\uFE02', '\uFE03', '\uFE04', '\uFE05', '\uFE06', '\uFE07',
  '\uFE08', '\uFE09', '\uFE0A', '\uFE0B', '\uFE0C', '\uFE0D', '\uFE0E', '\uFE0F', // Variation Selectors
];

// Control characters (C0 and C1 control codes)
export const CONTROL_CHARS_RANGES = [
  { start: 0x00, end: 0x1F }, // C0 controls
  { start: 0x7F, end: 0x9F }, // DEL + C1 controls
];

// Tag characters (used for invisible tagging)
export const TAG_CHARS_RANGE = { start: 0xE0000, end: 0xE007F };

// Bidirectional control characters
export const BIDI_CHARS = [
  '\u202A', // Left-to-Right Embedding
  '\u202B', // Right-to-Left Embedding
  '\u202C', // Pop Directional Formatting
  '\u202D', // Left-to-Right Override
  '\u202E', // Right-to-Right Override
  '\u2066', // Left-to-Right Isolate
  '\u2067', // Right-to-Left Isolate
  '\u2068', // First Strong Isolate
  '\u2069', // Pop Directional Isolate
];

// Bidi embedding pairs for matching
export const BIDI_PAIRS: Record<string, string> = {
  '\u202A': '\u202C', // LRE -> PDF
  '\u202B': '\u202C', // RLE -> PDF
  '\u202D': '\u202C', // LRO -> PDF
  '\u202E': '\u202C', // RLO -> PDF
  '\u2066': '\u2069', // LRI -> PDI
  '\u2067': '\u2069', // RLI -> PDI
  '\u2068': '\u2069', // FSI -> PDI
};

// Non-breaking spaces
export const NON_BREAKING_SPACES = [
  '\u00A0', // No-Break Space
  '\u202F', // Narrow No-Break Space
  '\u2007', // Figure Space
  '\u2008', // Punctuation Space
  '\u2009', // Thin Space
  '\u200A', // Hair Space
];

// Homoglyph mappings (visually similar characters from different scripts)
export const HOMOGLYPHS: Record<string, string> = {
  // Cyrillic to Latin (lowercase)
  '\u0430': 'a', '\u0435': 'e', '\u043E': 'o', '\u0440': 'p', 
  '\u0441': 'c', '\u0443': 'y', '\u0445': 'x', '\u0456': 'i',
  '\u0458': 'j', '\u043A': 'k',
  // Cyrillic to Latin (uppercase)
  '\u0410': 'A', '\u0412': 'B', '\u0415': 'E', '\u041A': 'K', 
  '\u041C': 'M', '\u041D': 'H', '\u041E': 'O', '\u0420': 'P', 
  '\u0421': 'C', '\u0422': 'T', '\u0425': 'X', '\u0405': 'S',
  '\u0406': 'I', '\u0408': 'J',
  // Greek to Latin (lowercase)
  '\u03B1': 'a', '\u03B2': 'b', '\u03B3': 'y', '\u03B5': 'e', 
  '\u03B9': 'i', '\u03BF': 'o', '\u03C1': 'p', '\u03C5': 'u',
  '\u03BD': 'v', '\u03C9': 'w',
  // Greek to Latin (uppercase)
  '\u0391': 'A', '\u0392': 'B', '\u0395': 'E', '\u0399': 'I', 
  '\u039A': 'K', '\u039C': 'M', '\u039D': 'N', '\u039F': 'O', 
  '\u03A1': 'P', '\u03A4': 'T', '\u03A7': 'X', '\u0396': 'Z',
};

// Suspicious punctuation
export const SUSPICIOUS_PUNCTUATION: Record<string, string> = {
  '\u2013': '-', // En Dash
  '\u2014': '-', // Em Dash
  '\u2018': "'", // Left Single Quotation Mark
  '\u2019': "'", // Right Single Quotation Mark
  '\u201C': '"', // Left Double Quotation Mark
  '\u201D': '"', // Right Double Quotation Mark
  '\u201A': ',', // Single Low-9 Quotation Mark
  '\u201E': '"', // Double Low-9 Quotation Mark
  '\u2039': '<', // Single Left-Pointing Angle Quotation Mark
  '\u203A': '>', // Single Right-Pointing Angle Quotation Mark
  '\u00AB': '"', // Left-Pointing Double Angle Quotation Mark
  '\u00BB': '"', // Right-Pointing Double Angle Quotation Mark
  '\u2026': '...', // Horizontal Ellipsis
};

// Helper to check if codepoint is in control character range
function isControlChar(codePoint: number): boolean {
  return CONTROL_CHARS_RANGES.some(
    range => codePoint >= range.start && codePoint <= range.end
  );
}

// Helper to check if codepoint is a tag character
function isTagChar(codePoint: number): boolean {
  return codePoint >= TAG_CHARS_RANGE.start && codePoint <= TAG_CHARS_RANGE.end;
}

// Detect ZWJ chains (zero-width joiner sequences)
function detectZWJChains(text: string): number {
  const zwjPattern = /\u200D[\u200D\uFE0F\u200B]*/g;
  const matches = text.match(zwjPattern) || [];
  return matches.filter(m => m.length > 2).length; // Only count chains, not single ZWJ
}

// Detect repeating invisible character patterns
function detectRepeatingInvisible(text: string): number {
  const invisibleSet = new Set([...ZERO_WIDTH_CHARS, ...INVISIBLE_CHARS, ...BIDI_CHARS]);
  let repeats = 0;
  let lastInvisible = '';
  let count = 0;

  for (const char of text) {
    if (invisibleSet.has(char)) {
      if (char === lastInvisible) {
        count++;
        if (count >= 2) repeats++;
      } else {
        lastInvisible = char;
        count = 1;
      }
    } else {
      lastInvisible = '';
      count = 0;
    }
  }
  
  return repeats;
}

// Detect unmatched bidi pairs
function detectUnmatchedBidi(text: string): number {
  const stack: string[] = [];
  let unmatched = 0;
  
  for (const char of text) {
    if (BIDI_PAIRS[char]) {
      stack.push(char);
    } else if (Object.values(BIDI_PAIRS).includes(char)) {
      if (stack.length === 0) {
        unmatched++;
      } else {
        const opener = stack.pop()!;
        if (BIDI_PAIRS[opener] !== char) {
          unmatched++;
        }
      }
    }
  }
  
  return unmatched + stack.length;
}

// Detect mixed text directionality (LTR + RTL in same line)
function detectMixedDirectionality(text: string): number {
  const lines = text.split('\n');
  let mixedLines = 0;
  
  const ltrPattern = /[a-zA-Z]/;
  const rtlPattern = /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  
  for (const line of lines) {
    if (ltrPattern.test(line) && rtlPattern.test(line)) {
      mixedLines++;
    }
  }
  
  return mixedLines;
}

// Detect potential encoded data (Base64, hex strings)
function detectEncodedData(text: string): number {
  let count = 0;
  
  // Base64 pattern (at least 20 chars)
  const base64Pattern = /[A-Za-z0-9+/]{20,}={0,2}/g;
  const base64Matches = text.match(base64Pattern) || [];
  count += base64Matches.length;
  
  // Hex pattern (at least 16 hex chars in sequence)
  const hexPattern = /[0-9a-fA-F]{16,}/g;
  const hexMatches = text.match(hexPattern) || [];
  count += hexMatches.length;
  
  return count;
}

// Calculate line-level density of anomalies (simplified to avoid recursion)
function calculateMaxLineDensity(highlightedPositions: Array<{ start: number; end: number; type: string; char: string }>, text: string): number {
  if (!text || highlightedPositions.length === 0) return 0;
  
  const lines = text.split('\n');
  let maxDensity = 0;
  let currentPos = 0;
  
  for (const line of lines) {
    if (line.length === 0) {
      currentPos += 1; // account for newline
      continue;
    }
    
    const lineEnd = currentPos + line.length;
    const lineIssues = highlightedPositions.filter(
      h => h.start >= currentPos && h.start < lineEnd
    ).length;
    
    const density = (lineIssues / line.length) * 100;
    maxDensity = Math.max(maxDensity, density);
    currentPos = lineEnd + 1; // +1 for newline
  }
  
  return Math.min(maxDensity, 100);
}

export function detectIssues(text: string): DetectionResult {
  // Normalize Unicode first (NFC normalization)
  const normalizedText = text.normalize('NFC');
  
  let zeroWidthChars = 0;
  let invisibleChars = 0;
  let homoglyphs = 0;
  let suspiciousPunctuation = 0;
  let bidiMarks = 0;
  let nonBreakingSpaces = 0;
  let unusualWhitespace = 0;
  let controlChars = 0;
  
  const highlightedPositions: Array<{ start: number; end: number; type: string; char: string }> = [];

  // Convert to array to handle Unicode correctly (fixes position tracking)
  const chars = Array.from(normalizedText);
  
  // Detect mixed scripts (expanded)
  const latinCount = (normalizedText.match(/[a-zA-Z]/g) || []).length;
  const cyrillicCount = (normalizedText.match(/[\u0400-\u04FF]/g) || []).length;
  const greekCount = (normalizedText.match(/[\u0370-\u03FF]/g) || []).length;
  const arabicCount = (normalizedText.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/g) || []).length;
  const hebrewCount = (normalizedText.match(/[\u0590-\u05FF]/g) || []).length;
  const devanagariCount = (normalizedText.match(/[\u0900-\u097F]/g) || []).length;
  
  let scriptCount = 0;
  if (latinCount > 0) scriptCount++;
  if (cyrillicCount > 0) scriptCount++;
  if (greekCount > 0) scriptCount++;
  if (arabicCount > 0) scriptCount++;
  if (hebrewCount > 0) scriptCount++;
  if (devanagariCount > 0) scriptCount++;
  const mixedScripts = scriptCount > 1 ? 1 : 0;

  // Count each type of issue and track positions (FIXED: proper position tracking)
  let position = 0;
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const codePoint = char.codePointAt(0)!;
    
    // Check control characters
    if (isControlChar(codePoint)) {
      controlChars++;
      highlightedPositions.push({ start: position, end: position + char.length, type: 'invisible', char });
    }
    
    // Check tag characters
    if (isTagChar(codePoint)) {
      invisibleChars++;
      highlightedPositions.push({ start: position, end: position + char.length, type: 'invisible', char });
    }
    
    // Check zero-width and invisible characters
    if (ZERO_WIDTH_CHARS.includes(char)) {
      zeroWidthChars++;
      highlightedPositions.push({ start: position, end: position + char.length, type: 'invisible', char });
    } else if (INVISIBLE_CHARS.includes(char)) {
      invisibleChars++;
      highlightedPositions.push({ start: position, end: position + char.length, type: 'invisible', char });
    }
    
    // Check homoglyphs
    if (HOMOGLYPHS[char]) {
      homoglyphs++;
      highlightedPositions.push({ start: position, end: position + char.length, type: 'homoglyph', char });
    }
    
    // Check suspicious punctuation
    if (SUSPICIOUS_PUNCTUATION[char]) {
      suspiciousPunctuation++;
      highlightedPositions.push({ start: position, end: position + char.length, type: 'punctuation', char });
    }
    
    // Check bidi marks
    if (BIDI_CHARS.includes(char)) {
      bidiMarks++;
      highlightedPositions.push({ start: position, end: position + char.length, type: 'bidi', char });
    }
    
    // Check non-breaking spaces
    if (NON_BREAKING_SPACES.includes(char)) {
      nonBreakingSpaces++;
      highlightedPositions.push({ start: position, end: position + char.length, type: 'space', char });
    }
    
    position += char.length;
  }

  // Detect unusual whitespace patterns (multiple spaces, tabs, etc.)
  const multiSpaces = (normalizedText.match(/  +/g) || []).length;
  const tabs = (normalizedText.match(/\t/g) || []).length;
  unusualWhitespace = multiSpaces + tabs;

  // Advanced detections
  const unmatchedBidi = detectUnmatchedBidi(normalizedText);
  const zwjChains = detectZWJChains(normalizedText);
  const repeatingInvisible = detectRepeatingInvisible(normalizedText);
  const mixedDirectionality = detectMixedDirectionality(normalizedText);
  const encodedData = detectEncodedData(normalizedText);

  const totalIssues = zeroWidthChars + invisibleChars + homoglyphs + 
    suspiciousPunctuation + bidiMarks + nonBreakingSpaces + unusualWhitespace + 
    mixedScripts + controlChars + unmatchedBidi + zwjChains + repeatingInvisible +
    mixedDirectionality + encodedData;

  // Calculate noise score (percentage of problematic characters)
  const noiseScore = normalizedText.length > 0 ? (totalIssues / normalizedText.length) * 100 : 0;
  
  // Calculate max line density (pass highlightedPositions to avoid recursion)
  const maxLineDensity = calculateMaxLineDensity(highlightedPositions, normalizedText);

  return {
    zeroWidthChars,
    invisibleChars,
    homoglyphs,
    mixedScripts,
    suspiciousPunctuation,
    bidiMarks,
    nonBreakingSpaces,
    unusualWhitespace,
    controlChars,
    unmatchedBidi,
    zwjChains,
    repeatingInvisible,
    mixedDirectionality,
    encodedData,
    totalIssues,
    noiseScore: Math.min(noiseScore, 100),
    maxLineDensity,
    highlightedPositions,
  };
}
