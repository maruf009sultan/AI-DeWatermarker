import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  accent?: boolean;
}

export function StatsCard({ icon: Icon, label, value, accent }: StatsCardProps) {
  return (
    <Card className={`p-4 transition-all duration-300 ${
      value > 0 
        ? accent 
          ? 'bg-warning/10 border-warning/30' 
          : 'bg-accent/20 border-accent/30'
        : 'bg-card/50 border-border/50'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          <p className={`text-2xl font-bold ${
            value > 0 
              ? accent 
                ? 'text-warning' 
                : 'text-accent'
              : 'text-muted-foreground'
          }`}>
            {value}
          </p>
        </div>
        <Icon className={`w-5 h-5 ${
          value > 0 
            ? accent 
              ? 'text-warning' 
              : 'text-accent'
            : 'text-muted-foreground'
        }`} />
      </div>
    </Card>
  );
}
