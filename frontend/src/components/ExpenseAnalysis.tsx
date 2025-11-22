import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useExpenseLog } from "@/hooks/useExpenseLog";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, RefreshCw } from "lucide-react";
import { useChainId } from "wagmi";
import { getContractAddress } from "@/abi/Addresses";

const ExpenseAnalysis = () => {
  const chainId = useChainId();
  const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || getContractAddress(chainId);

interface ExpenseEntry {
  date: number;
  category: number;
  level: number;
  emotion: number;
  timestamp: number;
}

  const { isConnected } = useAccount();
  const { getAllEntries, decryptEntry, isLoading } = useExpenseLog(CONTRACT_ADDRESS);
  const [entries, setEntries] = useState<ExpenseEntry[]>([]);
  const [decryptedEntries, setDecryptedEntries] = useState<Map<number, ExpenseEntry>>(new Map());
  const [categoryEmotionData, setCategoryEmotionData] = useState<any[]>([]);
  const [pressureTrendData, setPressureTrendData] = useState<any[]>([]);

  const loadAndAnalyze = async () => {
    if (!isConnected || !CONTRACT_ADDRESS) {
      console.log("Cannot analyze - not connected or no contract address");
      return;
    }

    try {
      console.log("Loading data for analysis...");
      const today = Math.floor(Date.now() / 86400000);
      const startDate = today - 30; // Last 30 days
      console.log("Analysis date range:", startDate, "to", today);
      const allEntries = await getAllEntries(startDate, today);
      console.log("Loaded entries for analysis:", allEntries.length);
      setEntries(allEntries);

      // Decrypt all entries for analysis
      const decryptedMap = new Map<number, ExpenseEntry>();
      for (const entry of allEntries) {
        try {
          console.log(`Decrypting entry for date ${entry.date}...`);
          const decrypted = await decryptEntry(entry.date);
          if (decrypted) {
            decryptedMap.set(entry.date, decrypted);
          }
        } catch (error) {
          console.warn(`Failed to decrypt entry for date ${entry.date}:`, error);
          // Continue with other entries
        }
      }

      setDecryptedEntries(decryptedMap);
      console.log(`Successfully decrypted ${decryptedMap.size} entries for analysis`);

      // Use decrypted data for analysis
      const decryptedArray = Array.from(decryptedMap.values());

      // Analyze category-emotion correlation
      const categoryEmotionMap = new Map<number, { total: number; count: number }>();
      decryptedArray.forEach((entry) => {
        if (!categoryEmotionMap.has(entry.category)) {
          categoryEmotionMap.set(entry.category, { total: 0, count: 0 });
        }
        const data = categoryEmotionMap.get(entry.category)!;
        data.total += entry.emotion;
        data.count += 1;
      });

      const categoryData = Array.from(categoryEmotionMap.entries())
        .map(([category, data]) => ({
          category: `Category ${category}`,
          avgEmotion: data.count > 0 ? (data.total / data.count).toFixed(2) : 0,
          count: data.count,
        }))
        .sort((a, b) => parseFloat(String(b.avgEmotion)) - parseFloat(String(a.avgEmotion)));

      setCategoryEmotionData(categoryData);

      // Analyze expense pressure trend (level over time)
      const trendData = decryptedArray
        .sort((a, b) => a.date - b.date)
        .map((entry) => ({
          date: new Date(entry.date * 86400000).toLocaleDateString(),
          level: entry.level,
          emotion: entry.emotion,
        }));

      setPressureTrendData(trendData);
    } catch (error) {
      console.error("Error loading analysis:", error);
    }
  };

  useEffect(() => {
    if (isConnected) {
      loadAndAnalyze();
    }
  }, [isConnected]);

  const mostAffectingCategory = categoryEmotionData.length > 0 
    ? categoryEmotionData[0] 
    : null;

  return (
    <Card className="border-border bg-card/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-3xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Expense Analysis
        </CardTitle>
        <CardDescription className="text-base">
          Analyze your encrypted expense data: category-emotion correlation and expense pressure trends
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isConnected ? (
          <p className="text-muted-foreground">Please connect your wallet to view analysis</p>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                <p>Found {entries.length} entries, analyzing {decryptedEntries.size} decrypted entries</p>
                {entries.length > decryptedEntries.size && (
                  <p className="text-xs text-orange-500">
                    Some entries couldn't be decrypted for analysis
                  </p>
                )}
              </div>
              <Button onClick={loadAndAnalyze} variant="outline" size="sm" disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh Analysis
              </Button>
            </div>

            {entries.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No entries found. Add expense entries to see analysis.
              </p>
            ) : (
              <>
                {/* Category-Emotion Correlation */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Category-Emotion Correlation</h3>
                  {mostAffectingCategory && (
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">
                            Most Affecting Category: {mostAffectingCategory.category}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Average Emotion: {mostAffectingCategory.avgEmotion} (from {mostAffectingCategory.count} entries)
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {categoryEmotionData.length > 0 && (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={categoryEmotionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="avgEmotion" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>

                {/* Expense Pressure Trend */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Expense Pressure Trend</h3>
                  {pressureTrendData.length > 0 && (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={pressureTrendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="level" stroke="hsl(var(--primary))" strokeWidth={2} />
                        <Line type="monotone" dataKey="emotion" stroke="hsl(var(--destructive))" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Blue line: Expense Level (1-10), Red line: Emotion (1-5)
                  </p>
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpenseAnalysis;

