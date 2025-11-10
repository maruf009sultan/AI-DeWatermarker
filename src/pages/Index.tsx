import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Shield, 
  Copy, 
  AlertCircle, 
  CheckCircle2,
  Clipboard,
  Zap
} from "lucide-react";
import { detectIssues, cleanText } from "@/utils/textCleaner";
import { TextAreaWithHighlights } from "@/components/TextAreaWithHighlights";
import { CleanedTextDisplay } from "@/components/CleanedTextDisplay";
import { HowItWorks } from "@/components/HowItWorks";

const Index = () => {
  const [inputText, setInputText] = useState("");
  const [cleanedText, setCleanedText] = useState("");
  const [stats, setStats] = useState(detectIssues(""));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const detection = detectIssues(inputText);
    const cleaned = cleanText(inputText);
    setStats(detection);
    setCleanedText(cleaned);
  }, [inputText]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
      toast.success("Text pasted successfully!");
    } catch (err) {
      toast.error("Failed to paste. Please use Ctrl+V or Cmd+V");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cleanedText);
      setCopied(true);
      toast.success("Cleaned text copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy text");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      {/* Animated background with grid */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-12 space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Shield className="w-12 h-12 text-primary drop-shadow-[0_0_20px_rgba(59,211,255,0.5)]" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
            </div>
            <h1 className="text-6xl font-extrabold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              AI DeWatermarker
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Real-time detection and removal of AI watermarks, invisible Unicode, and text obfuscation
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20">Free & Open Source</span>
            <span className="px-3 py-1 rounded-full bg-success/10 border border-success/20">Privacy First</span>
            <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20">Real-Time</span>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-[1fr_280px] gap-6 mb-6">
          {/* Input Panel */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-warning" />
                  Suspicious Text
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {inputText.length} chars
                  </span>
                  <Button
                    onClick={handlePaste}
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs"
                  >
                    <Clipboard className="w-3 h-3 mr-1" />
                    Paste
                  </Button>
                </div>
              </div>
              <TextAreaWithHighlights
                value={inputText}
                onChange={setInputText}
                highlights={stats.highlightedPositions}
                placeholder="Paste text here to detect AI watermarks and hidden characters..."
              />
              {stats.totalIssues > 0 && (
                <div className="flex items-center gap-2 text-xs px-3 py-2 bg-warning/10 border border-warning/30 rounded-lg">
                  <Zap className="w-3 h-3 text-warning" />
                  <span className="text-warning font-medium">
                    {stats.totalIssues} suspicious {stats.totalIssues === 1 ? 'character' : 'characters'} detected
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* Detailed Detection Report */}
          <Card className="p-5 bg-card/50 backdrop-blur-sm border-border/50 h-fit">
            <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Detection Report
            </h2>
            <div className="space-y-3">
              {/* Noise Score - Primary */}
              <div className={`p-3 rounded-lg border ${
                stats.noiseScore > 5 
                  ? 'bg-destructive/10 border-destructive/30' 
                  : 'bg-success/10 border-success/30'
              }`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium">Noise Score</span>
                  <span className={`text-2xl font-bold ${
                    stats.noiseScore > 5 ? 'text-destructive' : 'text-success'
                  }`}>
                    {stats.noiseScore.toFixed(1)}%
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  {stats.noiseScore > 10 ? 'High suspicion of AI watermarking' : 
                   stats.noiseScore > 5 ? 'Moderate watermark presence' : 
                   'Clean or minimal obfuscation'}
                </p>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between items-center py-1.5 border-b border-border/30">
                  <span className="text-xs text-muted-foreground">Total Issues</span>
                  <span className={`text-sm font-bold ${stats.totalIssues > 0 ? 'text-destructive' : 'text-success'}`}>
                    {stats.totalIssues}
                  </span>
                </div>

                {stats.zeroWidthChars > 0 && (
                  <div className="p-2 rounded bg-destructive/5 border border-destructive/20">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-destructive">Zero-Width Chars</span>
                      <span className="text-sm font-bold text-destructive">{stats.zeroWidthChars}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">Invisible characters used for tracking</p>
                  </div>
                )}

                {stats.invisibleChars > 0 && (
                  <div className="p-2 rounded bg-destructive/5 border border-destructive/20">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-destructive">Invisible Chars</span>
                      <span className="text-sm font-bold text-destructive">{stats.invisibleChars}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">Hidden Unicode like soft hyphens</p>
                  </div>
                )}
                
                {stats.homoglyphs > 0 && (
                  <div className="p-2 rounded bg-warning/5 border border-warning/20">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-warning">Homoglyphs</span>
                      <span className="text-sm font-bold text-warning">{stats.homoglyphs}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">Look-alike chars (е vs e, а vs a)</p>
                  </div>
                )}

                {stats.bidiMarks > 0 && (
                  <div className="p-2 rounded bg-destructive/5 border border-destructive/20">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-destructive">Bidi Marks</span>
                      <span className="text-sm font-bold text-destructive">{stats.bidiMarks}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">Direction control chars for obfuscation</p>
                  </div>
                )}

                {stats.suspiciousPunctuation > 0 && (
                  <div className="p-2 rounded bg-blue-500/5 border border-blue-500/20">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-blue-400">Suspicious Punct.</span>
                      <span className="text-sm font-bold text-blue-400">{stats.suspiciousPunctuation}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">Non-standard quotes/dashes</p>
                  </div>
                )}

                {stats.nonBreakingSpaces > 0 && (
                  <div className="p-2 rounded bg-purple-500/5 border border-purple-500/20">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-purple-400">Special Spaces</span>
                      <span className="text-sm font-bold text-purple-400">{stats.nonBreakingSpaces}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">Non-breaking & em spaces</p>
                  </div>
                )}

                {stats.mixedScripts > 0 && (
                  <div className="p-2 rounded bg-warning/5 border border-warning/20">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-3 h-3 text-warning mt-0.5" />
                      <div className="flex-1">
                        <span className="text-xs font-medium text-warning block">Mixed Scripts Detected</span>
                        <p className="text-[10px] text-muted-foreground">Cyrillic/Latin/Greek mixing</p>
                      </div>
                    </div>
                  </div>
                )}

                {stats.totalIssues === 0 && inputText.length > 0 && (
                  <div className="flex items-center gap-2 p-2 text-xs text-success bg-success/5 border border-success/20 rounded">
                    <CheckCircle2 className="w-4 h-4" />
                    <div>
                      <span className="font-medium block">Clean Text</span>
                      <span className="text-[10px] text-muted-foreground">No suspicious patterns detected</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Output Panel */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                Cleaned Output
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">
                  {cleanedText.length} chars
                </span>
                <Button
                  onClick={handleCopy}
                  disabled={!cleanedText}
                  size="sm"
                  className={`transition-all h-8 text-xs ${
                    copied 
                      ? 'bg-success text-success-foreground' 
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
            <CleanedTextDisplay 
              originalText={inputText}
              cleanedText={cleanedText}
            />
            {stats.totalIssues > 0 && cleanedText && (
              <div className="flex items-center gap-2 text-xs px-3 py-2 bg-success/10 border border-success/30 rounded-lg">
                <CheckCircle2 className="w-3 h-3 text-success" />
                <span className="text-success font-medium">
                  Removed {stats.totalIssues} suspicious {stats.totalIssues === 1 ? 'character' : 'characters'}
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Legend */}
        <Card className="mt-6 p-4 bg-card/30 backdrop-blur-sm border-border/30">
          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
            <span className="font-semibold text-foreground">Detection highlights:</span>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-red-500 rounded shadow-[0_0_4px_rgba(239,68,68,0.6)]"></div>
              <span>Invisible/Bidi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-amber-500 rounded shadow-[0_0_4px_rgba(245,158,11,0.6)]"></div>
              <span>Homoglyphs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-blue-500 rounded shadow-[0_0_4px_rgba(59,130,246,0.6)]"></div>
              <span>Suspicious Punct.</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-purple-500 rounded shadow-[0_0_4px_rgba(168,85,247,0.6)]"></div>
              <span>Spaces</span>
            </div>
          </div>
        </Card>

        {/* How It Works Section */}
        <div className="mt-12">
          <HowItWorks />
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-muted-foreground pb-8">
          <p>Made with ❤️ for the open-source community • All processing happens locally in your browser</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
