import {
  ZERO_WIDTH_CHARS,
  INVISIBLE_CHARS,
  BIDI_CHARS,
  HOMOGLYPHS,
  SUSPICIOUS_PUNCTUATION,
  NON_BREAKING_SPACES,
} from './detection';

export * from './detection';

export function cleanText(text: string): string {
  // First normalize Unicode to NFC
  let cleaned = text.normalize('NFC');

  // Remove zero-width characters
  for (const char of ZERO_WIDTH_CHARS) {
    cleaned = cleaned.split(char).join('');
  }

  // Remove invisible characters
  for (const char of INVISIBLE_CHARS) {
    cleaned = cleaned.split(char).join('');
  }

  // Remove bidirectional marks
  for (const char of BIDI_CHARS) {
    cleaned = cleaned.split(char).join('');
  }

  // Remove control characters (0x00-0x1F except \n, \r, \t and 0x7F-0x9F)
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');

  // Remove tag characters (U+E0000 to U+E007F)
  cleaned = cleaned.replace(/[\uDB40][\uDC00-\uDC7F]/gu, '');

  // Replace homoglyphs
  for (const [homoglyph, replacement] of Object.entries(HOMOGLYPHS)) {
    cleaned = cleaned.split(homoglyph).join(replacement);
  }

  // Replace suspicious punctuation
  for (const [suspicious, replacement] of Object.entries(SUSPICIOUS_PUNCTUATION)) {
    cleaned = cleaned.split(suspicious).join(replacement);
  }

  // Replace non-breaking spaces with regular spaces
  for (const char of NON_BREAKING_SPACES) {
    cleaned = cleaned.split(char).join(' ');
  }

  // Replace tabs with spaces
  cleaned = cleaned.replace(/\t/g, ' ');

  // Collapse multiple spaces into single space
  cleaned = cleaned.replace(/  +/g, ' ');

  // Normalize line endings to \n
  cleaned = cleaned.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Trim trailing spaces on each line
  cleaned = cleaned.split('\n').map(line => line.trimEnd()).join('\n');

  // Trim overall text
  cleaned = cleaned.trim();

  return cleaned;
}
