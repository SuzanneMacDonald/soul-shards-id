import { useState } from "react";
import { Plus, Lock, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { toast } from "sonner";

interface Attribute {
  label: string;
  value: string;
  encrypted: boolean;
}

export const MintSection = () => {
  const [attributes, setAttributes] = useState<Attribute[]>([
    { label: "Age", value: "", encrypted: true },
    { label: "Credential", value: "", encrypted: false },
  ]);

  const addAttribute = () => {
    setAttributes([...attributes, { label: "", value: "", encrypted: false }]);
  };

  const updateAttribute = (index: number, field: keyof Attribute, value: string | boolean) => {
    const updated = [...attributes];
    updated[index] = { ...updated[index], [field]: value };
    setAttributes(updated);
  };

  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleMint = () => {
    const filledAttributes = attributes.filter(attr => attr.label && attr.value);
    if (filledAttributes.length === 0) {
      toast.error("Please add at least one attribute");
      return;
    }
    
    toast.success("Identity NFT minted successfully!", {
      description: "Your encrypted credentials are now on-chain",
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-8 bg-gradient-to-br from-card to-secondary border-2 border-primary/30 shadow-[0_0_30px_hsl(var(--cyber-cyan)/0.2)]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          Mint Identity NFT
        </h2>
        <p className="text-sm text-muted-foreground">
          Add attributes and choose which ones to encrypt on-chain
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {attributes.map((attr, index) => (
          <div 
            key={index}
            className="p-4 rounded-lg bg-secondary/50 border border-border/50 space-y-3"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5">Label</Label>
                <Input
                  value={attr.label}
                  onChange={(e) => updateAttribute(index, "label", e.target.value)}
                  placeholder="e.g., Age, Degree"
                  className="bg-background/50 border-border/50 focus:border-primary"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5">Value</Label>
                <Input
                  value={attr.value}
                  onChange={(e) => updateAttribute(index, "value", e.target.value)}
                  placeholder="e.g., Over 18"
                  className="bg-background/50 border-border/50 focus:border-primary"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  checked={attr.encrypted}
                  onCheckedChange={(checked) => updateAttribute(index, "encrypted", checked)}
                  className="data-[state=checked]:bg-primary"
                />
                <Label className="text-sm flex items-center gap-1.5 cursor-pointer">
                  {attr.encrypted && <Lock className="w-3 h-3 text-primary" />}
                  Encrypt on-chain
                </Label>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeAttribute(index)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={addAttribute}
          className="flex-1 border-primary/50 hover:bg-primary/10 hover:border-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Attribute
        </Button>
        
        <Button
          onClick={handleMint}
          className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-[0_0_20px_hsl(var(--cyber-cyan)/0.4)]"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Mint NFT
        </Button>
      </div>
    </Card>
  );
};
