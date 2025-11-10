import { useRef, useEffect } from "react";
import { HOMOGLYPHS, SUSPICIOUS_PUNCTUATION, ZERO_WIDTH_CHARS, INVISIBLE_CHARS, BIDI_CHARS, NON_BREAKING_SPACES } from "@/utils/detection";

interface CleanedTextDisplayProps {
  originalText: string;
  cleanedText: string;
}

export function CleanedTextDisplay({ originalText, cleanedText }: CleanedTextDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const renderCleanedWithHighlights = () => {
    if (!cleanedText || !originalText) return cleanedText;

    const changes: Array<{ position: number; type: string; original: string; cleaned: string }> = [];
    
    let origPos = 0;
    let cleanPos = 0;

    // Track changes between original and cleaned text
    while (origPos < originalText.length) {
      const origChar = originalText[origPos];
      const cleanChar = cleanedText[cleanPos] || '';

      // Check if character was removed (invisible/zero-width/bidi)
      if (
        ZERO_WIDTH_CHARS.includes(origChar) ||
        INVISIBLE_CHARS.includes(origChar) ||
        BIDI_CHARS.includes(origChar)
      ) {
        origPos++;
        continue; // Don't advance cleanPos, character was removed
      }

      // Check if character was replaced
      const homoglyphReplacement = HOMOGLYPHS[origChar];
      const punctReplacement = SUSPICIOUS_PUNCTUATION[origChar];
      const isNonBreakingSpace = NON_BREAKING_SPACES.includes(origChar);

      if (homoglyphReplacement && cleanChar === homoglyphReplacement) {
        changes.push({
          position: cleanPos,
          type: 'homoglyph',
          original: origChar,
          cleaned: cleanChar,
        });
      } else if (punctReplacement && cleanedText.substr(cleanPos, punctReplacement.length) === punctReplacement) {
        changes.push({
          position: cleanPos,
          type: 'punctuation',
          original: origChar,
          cleaned: punctReplacement,
        });
      } else if (isNonBreakingSpace && cleanChar === ' ') {
        changes.push({
          position: cleanPos,
          type: 'space',
          original: origChar,
          cleaned: ' ',
        });
      }

      origPos++;
      cleanPos++;
    }

    // Build the highlighted output
    const parts: JSX.Element[] = [];
    let lastPos = 0;

    changes.forEach((change, idx) => {
      // Add text before the change
      if (change.position > lastPos) {
        parts.push(
          <span key={`text-${idx}`}>
            {cleanedText.substring(lastPos, change.position)}
          </span>
        );
      }

      // Add highlighted changed character
      let bgColor = '';
      let tooltip = '';

      switch (change.type) {
        case 'homoglyph':
          bgColor = 'bg-warning/20 border-b-2 border-warning';
          tooltip = `Changed: ${change.original} → ${change.cleaned}`;
          break;
        case 'punctuation':
          bgColor = 'bg-accent/20 border-b-2 border-accent';
          tooltip = `Changed: ${change.original} → ${change.cleaned}`;
          break;
        case 'space':
          bgColor = 'bg-primary/20 border-b-2 border-primary';
          tooltip = 'Normalized space';
          break;
      }

      parts.push(
        <span
          key={`change-${idx}`}
          className={`${bgColor} rounded px-0.5`}
          title={tooltip}
        >
          {change.cleaned}
        </span>
      );

      lastPos = change.position + change.cleaned.length;
    });

    // Add remaining text
    if (lastPos < cleanedText.length) {
      parts.push(
        <span key="text-end">
          {cleanedText.substring(lastPos)}
        </span>
      );
    }

    return <>{parts}</>;
  };

  return (
    <div 
      ref={containerRef}
      className="w-full h-64 p-4 bg-secondary/50 border border-border rounded-lg overflow-auto whitespace-pre-wrap break-words font-mono text-sm text-foreground"
    >
      {renderCleanedWithHighlights()}
      {!cleanedText && (
        <span className="text-muted-foreground">Cleaned text appears here automatically...</span>
      )}
    </div>
  );
}
