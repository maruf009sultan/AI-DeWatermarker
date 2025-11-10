import { useRef, useEffect, useState } from "react";
import { ZERO_WIDTH_CHARS, INVISIBLE_CHARS } from "@/utils/detection";

interface HighlightPosition {
  start: number;
  end: number;
  type: string;
  char: string;
}

interface HighlightedTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  highlights: HighlightPosition[];
  placeholder?: string;
}

export function HighlightedTextArea({
  value,
  onChange,
  highlights,
  placeholder,
}: HighlightedTextAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleScroll = () => {
    if (textareaRef.current) {
      setScrollTop(textareaRef.current.scrollTop);
      setScrollLeft(textareaRef.current.scrollLeft);
    }
  };

  useEffect(() => {
    if (highlightRef.current) {
      highlightRef.current.scrollTop = scrollTop;
      highlightRef.current.scrollLeft = scrollLeft;
    }
  }, [scrollTop, scrollLeft]);

  const renderHighlightedText = () => {
    if (!value) return null;
    
    const parts: JSX.Element[] = [];
    let lastIndex = 0;

    // Sort highlights by start position
    const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);

    sortedHighlights.forEach((highlight, idx) => {
      // Add text before highlight
      if (highlight.start > lastIndex) {
        const textBefore = value.substring(lastIndex, highlight.start);
        parts.push(
          <span key={`text-${idx}`} className="opacity-100">
            {textBefore}
          </span>
        );
      }

      // Add highlighted character with strong visible colors
      let bgColor = '';
      let shadow = '';
      
      switch (highlight.type) {
        case 'invisible':
        case 'bidi':
          bgColor = 'bg-red-500/90';
          shadow = 'shadow-[0_0_8px_rgba(239,68,68,0.6)]';
          break;
        case 'homoglyph':
          bgColor = 'bg-amber-500/90';
          shadow = 'shadow-[0_0_8px_rgba(245,158,11,0.6)]';
          break;
        case 'punctuation':
          bgColor = 'bg-blue-500/90';
          shadow = 'shadow-[0_0_8px_rgba(59,130,246,0.6)]';
          break;
        case 'space':
          bgColor = 'bg-purple-500/90';
          shadow = 'shadow-[0_0_8px_rgba(168,85,247,0.6)]';
          break;
        default:
          bgColor = 'bg-amber-500/90';
          shadow = 'shadow-[0_0_8px_rgba(245,158,11,0.6)]';
      }

      const highlightedChar = value.substring(highlight.start, highlight.end);
      const isZeroOrInvisible = highlightedChar.trim() === '' || ZERO_WIDTH_CHARS.includes(highlightedChar) || INVISIBLE_CHARS.includes(highlightedChar);
      const displayChar = isZeroOrInvisible ? '' : highlightedChar;

      parts.push(
        <span
          key={`highlight-${idx}`}
          className={`${bgColor} ${shadow}`}
          title={`Suspicious ${highlight.type}: U+${highlight.char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}`}
          style={{ position: 'relative' }}
        >
          {isZeroOrInvisible ? (
            <span
              aria-hidden
              className="absolute -translate-x-0.5 select-none text-white font-black"
            >
              ·
            </span>
          ) : (
            <span className="text-white font-black">{displayChar}</span>
          )}
        </span>
      );

      lastIndex = highlight.end;
    });

    // Add remaining text
    if (lastIndex < value.length) {
      parts.push(
        <span key="text-end" className="opacity-100">
          {value.substring(lastIndex)}
        </span>
      );
    }

    return <>{parts}</>;
  };

  return (
    <div className="relative w-full h-64">
      {/* Highlighted background layer */}
      <div
        ref={highlightRef}
        className="absolute inset-0 p-4 bg-secondary/50 border border-border rounded-lg overflow-auto whitespace-pre-wrap break-words font-mono leading-relaxed pointer-events-none z-10"
        style={{
          fontSize: '14px',
          lineHeight: '1.5',
          textShadow: '0 0 1px rgba(0,0,0,0.1)',
        }}
      >
        {value ? renderHighlightedText() : <span className="text-muted-foreground">{placeholder}</span>}
      </div>

      {/* Invisible textarea overlay for input */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        className="absolute inset-0 w-full h-full p-4 bg-transparent border-2 border-transparent rounded-lg resize-none focus:outline-none focus:border-primary/50 transition-all font-mono leading-relaxed z-20 selection:bg-primary/30 selection:text-transparent"
        style={{
          fontSize: '14px',
          lineHeight: '1.5',
          color: 'transparent',
          caretColor: 'hsl(var(--primary))',
          WebkitTextFillColor: 'transparent',
        }}
        spellCheck={false}
      />
    </div>
  );
}
