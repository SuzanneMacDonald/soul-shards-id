import { useState } from "react";
import { Shield, Lock, Eye, EyeOff } from "lucide-react";
import { Card } from "./ui/card";

interface IdentityCardProps {
  name: string;
  attributes: { label: string; value: string; encrypted: boolean }[];
  isActive?: boolean;
}

export const IdentityCard = ({ name, attributes, isActive }: IdentityCardProps) => {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const toggleReveal = (index: number) => {
    setRevealed(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <Card 
      className={`
        relative w-80 h-96 p-6 
        bg-gradient-to-br from-card via-card to-secondary
        border-2 transition-all duration-500
        ${isActive 
          ? 'border-primary shadow-[0_0_30px_hsl(var(--cyber-cyan)/0.5)] scale-105' 
          : 'border-border/30 opacity-70 scale-95'
        }
      `}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      {/* Holographic overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-lg pointer-events-none" />
      
      {/* Glow effect */}
      {isActive && (
        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary opacity-20 blur-xl animate-glow-pulse -z-10" />
      )}

      {/* Card content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-primary/30">
          <div className="p-2 rounded-lg bg-primary/20 border border-primary/50">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">{name}</h3>
            <p className="text-xs text-muted-foreground">Identity NFT</p>
          </div>
        </div>

        {/* Attributes */}
        <div className="flex-1 space-y-3 overflow-y-auto">
          {attributes.map((attr, index) => (
            <div 
              key={index}
              className="p-3 rounded-lg bg-secondary/50 border border-border/50 hover:border-primary/50 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">{attr.label}</span>
                {attr.encrypted && (
                  <button
                    onClick={() => toggleReveal(index)}
                    className="p-1 hover:bg-primary/20 rounded transition-colors"
                  >
                    {revealed[index] ? (
                      <Eye className="w-4 h-4 text-primary" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                {attr.encrypted && !revealed[index] ? (
                  <>
                    <Lock className="w-3 h-3 text-primary" />
                    <span className="text-xs font-mono text-primary">████████████</span>
                  </>
                ) : (
                  <span className="text-sm text-foreground">{attr.value}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-primary/30 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">On-Chain Verified</span>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className="w-1.5 h-1.5 rounded-full bg-primary animate-glow-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
