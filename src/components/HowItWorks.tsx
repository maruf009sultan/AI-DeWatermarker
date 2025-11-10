import { Card } from "@/components/ui/card";
import { Shield, Search, Sparkles, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HowItWorks() {
  const steps = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Paste Your Text",
      description: "Simply paste any text that might contain AI watermarks, hidden characters, or obfuscation."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Real-Time Detection",
      description: "Our scanner instantly detects invisible Unicode, homoglyphs, Bidi marks, and suspicious characters."
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Get Clean Text",
      description: "Copy the cleaned output with all watermarks and obfuscation removed, ready to use anywhere."
    }
  ];

  return (
    <Card className="p-8 bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm border-border/50">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Advanced AI watermark detection and removal in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative p-6 rounded-xl bg-secondary/30 border border-border/50 hover:border-primary/50 transition-all group"
            >
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-primary-foreground shadow-lg">
                {idx + 1}
              </div>
              <div className="mb-4 text-primary group-hover:scale-110 transition-transform inline-block">
                {step.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 pt-4 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            This is an open-source project. View the code, contribute, or star on GitHub!
          </p>
          <Button
            variant="outline"
            size="lg"
            className="group hover:bg-primary hover:text-primary-foreground transition-all"
            onClick={() => window.open('https://github.com/yourusername/ai-dewatermarker', '_blank')}
          >
            <Github className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
            View on GitHub
          </Button>
        </div>
      </div>
    </Card>
  );
}
