import { useState } from "react";
import { Wallet, Check } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

export const WalletConnect = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");

  const handleConnect = () => {
    // Simulate wallet connection
    setTimeout(() => {
      const mockAddress = "0x" + Math.random().toString(16).substring(2, 10);
      setAddress(mockAddress);
      setIsConnected(true);
      toast.success("Wallet connected successfully!");
    }, 1000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setAddress("");
    toast.info("Wallet disconnected");
  };

  return (
    <div className="flex items-center gap-4">
      {isConnected ? (
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/50 flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" />
            <span className="text-sm font-mono text-foreground">
              {address.substring(0, 6)}...{address.substring(address.length - 4)}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDisconnect}
            className="border border-border/50 hover:border-destructive/50 hover:text-destructive"
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleConnect}
          className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity border border-primary/50 shadow-[0_0_20px_hsl(var(--cyber-cyan)/0.3)]"
        >
          <Wallet className="w-4 h-4 mr-2" />
          Connect Rainbow Wallet
        </Button>
      )}
    </div>
  );
};
