import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useExpenseLog } from "@/hooks/useExpenseLog";
import { Lock, Unlock, RefreshCw } from "lucide-react";
import { useChainId } from "wagmi";
import { getContractAddress } from "@/abi/Addresses";

const ExpenseHistory = () => {
  const chainId = useChainId();
  const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || getContractAddress(chainId);

interface ExpenseEntry {
  date: number;
  category: number;
  level: number;
  emotion: number;
  timestamp: number;
}

  const { isConnected, address } = useAccount();
  const { entryCount, getAllEntries, decryptEntry, isLoading, message } = useExpenseLog(CONTRACT_ADDRESS);
  const [entries, setEntries] = useState<ExpenseEntry[]>([]);
  const [decryptedEntries, setDecryptedEntries] = useState<Map<number, ExpenseEntry>>(new Map());
  const [loadingDecrypt, setLoadingDecrypt] = useState<Set<number>>(new Set());

  const loadEntries = async () => {
    if (!isConnected || !CONTRACT_ADDRESS) {
      console.log("Cannot load entries - not connected or no contract address");
      return;
    }

    try {
      console.log("Loading entries for last 30 days...");
      const today = Math.floor(Date.now() / 86400000);
      const startDate = Math.max(0, today - 30); // Last 30 days, ensure non-negative
      console.log("Date range:", startDate, "to", today);

      if (startDate >= today) {
        console.warn("Invalid date range for entry loading");
        return;
      }

      try {
        const allEntries = await getAllEntries(startDate, today);
      console.log("Loaded entries:", allEntries.length);
      setEntries(allEntries);
    } catch (error: any) {
      console.error("Error loading entries:", error);
      // Don't show error to user if it's just missing data
      if (!error.message?.includes("Missing requirements")) {
        // Could show a user-friendly message here
      }
    }
  };

  useEffect(() => {
    if (isConnected) {
      loadEntries();
    }
  }, [isConnected, entryCount]);

  const handleDecrypt = async (date: number) => {
    if (decryptedEntries.has(date)) {
      // Already decrypted, remove it
      const newMap = new Map(decryptedEntries);
      newMap.delete(date);
      setDecryptedEntries(newMap);
      return;
    }

    setLoadingDecrypt(new Set([...loadingDecrypt, date]));
    try {
      const entry = await decryptEntry(date);
      if (entry) {
        setDecryptedEntries(new Map(decryptedEntries.set(date, entry)));
      }
    } catch (error) {
      console.error("Error decrypting entry:", error);
    } finally {
      const newSet = new Set(loadingDecrypt);
      newSet.delete(date);
      setLoadingDecrypt(newSet);
    }
  };

  const formatDate = (date: number) => {
    const dateObj = new Date(date * 86400000);
    return dateObj.toLocaleDateString();
  };

  return (
    <Card className="border-border bg-card/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-3xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Expense History
        </CardTitle>
        <CardDescription className="text-base">
          View and decrypt your encrypted expense entries
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <p className="text-muted-foreground">Please connect your wallet to view entries</p>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Total entries: {entryCount}
              </p>
              <Button onClick={loadEntries} variant="outline" size="sm" disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>

            {message && (
              <div className={`rounded-lg p-4 ${
                message.includes("Error")
                  ? "bg-destructive/10 border border-destructive/20"
                  : "bg-muted/50"
              }`}>
                <p className={`text-sm ${
                  message.includes("Error")
                    ? "text-destructive"
                    : "text-foreground"
                }`}>{message}</p>
              </div>
            )}

            {entries.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No entries found. Add your first expense entry to get started.
              </p>
            ) : (
              <div className="space-y-2">
                {entries.map((entry) => {
                  const decrypted = decryptedEntries.get(entry.date);
                  const isDecrypting = loadingDecrypt.has(entry.date);

                  return (
                    <div
                      key={entry.date}
                      className="border rounded-lg p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Date: {formatDate(entry.date)}</p>
                          <p className="text-xs text-muted-foreground">
                            Timestamp: {new Date(entry.timestamp * 1000).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          onClick={() => handleDecrypt(entry.date)}
                          variant="outline"
                          size="sm"
                          disabled={isDecrypting}
                        >
                          {decrypted ? (
                            <>
                              <Unlock className="w-4 h-4 mr-2" />
                              Hide
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4 mr-2" />
                              {isDecrypting ? "Decrypting..." : "Decrypt"}
                            </>
                          )}
                        </Button>
                      </div>
                      {decrypted && (
                        <div className="mt-2 p-3 bg-muted/50 rounded space-y-1">
                          <p className="text-sm">
                            <span className="font-medium">Category:</span> {decrypted.category}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Level:</span> {decrypted.level}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Emotion:</span> {decrypted.emotion}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpenseHistory;

