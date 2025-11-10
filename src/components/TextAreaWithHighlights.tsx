import { useRef, useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";

interface HighlightPosition {
  start: number;
  end: number;
  type: string;
  char: string;
}

interface TextAreaWithHighlightsProps {
  value: string;
  onChange: (value: string) => void;
  highlights: HighlightPosition[];
  placeholder?: string;
}

export function TextAreaWithHighlights({
  value,
  onChange,
  highlights,
  placeholder,
}: TextAreaWithHighlightsProps) {
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

  const renderWithInlineHighlights = () => {
    if (!value) return null;
    
    const parts: JSX.Element[] = [];
    let lastIndex = 0;

    const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);

    sortedHighlights.forEach((highlight, idx) => {
      if (highlight.start > lastIndex) {
        parts.push(
          <span key={`text-${idx}`}>
            {value.substring(lastIndex, highlight.start)}
          </span>
        );
      }

      let bgColor = '';
      
      switch (highlight.type) {
        case 'invisible':
        case 'bidi':
          bgColor = 'bg-red-500/20 border-b-2 border-red-500';
          break;
        case 'homoglyph':
          bgColor = 'bg-amber-500/20 border-b-2 border-amber-500';
          break;
        case 'punctuation':
          bgColor = 'bg-blue-500/20 border-b-2 border-blue-500';
          break;
        case 'space':
          bgColor = 'bg-purple-500/20 border-b-2 border-purple-500';
          break;
        default:
          bgColor = 'bg-amber-500/20 border-b-2 border-amber-500';
      }

      const highlightedChar = value.substring(highlight.start, highlight.end);

      parts.push(
        <span
          key={`highlight-${idx}`}
          className={`${bgColor} rounded px-0.5`}
          title={`Suspicious ${highlight.type}: U+${highlight.char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}`}
        >
          {highlightedChar || '·'}
        </span>
      );

      lastIndex = highlight.end;
    });

    if (lastIndex < value.length) {
      parts.push(
        <span key="text-end">
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
        className="absolute inset-0 p-4 bg-secondary/50 border border-border rounded-lg overflow-auto whitespace-pre-wrap break-words font-mono text-sm leading-relaxed pointer-events-none z-10"
      >
        {value ? renderWithInlineHighlights() : <span className="text-muted-foreground">{placeholder}</span>}
      </div>

      {/* Editable textarea overlay */}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        placeholder={!value ? placeholder : ""}
        className="absolute inset-0 w-full h-full p-4 bg-transparent border-2 border-transparent rounded-lg resize-none focus:outline-none focus:border-primary/50 transition-all font-mono text-sm leading-relaxed z-20 text-transparent caret-primary selection:bg-primary/30"
        style={{
          caretColor: 'hsl(var(--primary))',
        }}
        spellCheck={false}
      />
    </div>
  );
}
