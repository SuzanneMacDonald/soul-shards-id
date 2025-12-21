import { useState } from "react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useExpenseLog } from "@/hooks/useExpenseLog";
import { Lock, Plus, Shield, Zap, Heart } from "lucide-react";
import { useChainId } from "wagmi";
import { getContractAddress } from "@/abi/Addresses";

const ExpenseEntryForm = () => {
  const chainId = useChainId();
  const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || getContractAddress(chainId);

  const { isConnected, address } = useAccount();
  const { addEntry, isLoading, message } = useExpenseLog(CONTRACT_ADDRESS);
  const [category, setCategory] = useState("1");
  const [level, setLevel] = useState("1");
  const [emotion, setEmotion] = useState("1");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    if (!CONTRACT_ADDRESS) {
      alert("Contract address not configured");
      return;
    }

    const categoryNum = parseInt(category);
    const levelNum = parseInt(level);
    const emotionNum = parseInt(emotion);

    if (!category || !level || !emotion || category.trim() === "" || level.trim() === "" || emotion.trim() === "") {
      alert("All fields are required");
      return;
    }

    if (isNaN(categoryNum) || categoryNum < 1 || categoryNum > 5) {
      alert("Category must be a number between 1 and 5");
      return;
    }
    if (isNaN(levelNum) || levelNum < 1 || levelNum > 10) {
      alert("Level must be a number between 1 and 10");
      return;
    }
    if (isNaN(emotionNum) || emotionNum < 1 || emotionNum > 5) {
      alert("Emotion must be a number between 1 and 5");
      return;
    }

    try {
      const date = Math.floor(Date.now() / 86400000); // Day number since epoch
      await addEntry(
        date,
        categoryNum,
        levelNum,
        emotionNum
      );
      // Reset form
      setCategory("1");
      setLevel("1");
      setEmotion("1");
    } catch (error: any) {
      console.error("Error adding entry:", error);
      const errorMessage = error?.message || error?.reason || "Unknown error occurred";
      alert(`Failed to add entry: ${errorMessage}`);
    }
  };

  return (
    <Card className="border-border bg-card/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-3xl bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent font-bold">
          Log New Encrypted Expense
        </CardTitle>
        <CardDescription className="text-base">
          Securely encrypt and record your expense data anonymously
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category">Expense Category (1-5)</Label>
            <Select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="1">Category 1</option>
              <option value="2">Category 2</option>
              <option value="3">Category 3</option>
              <option value="4">Category 4</option>
              <option value="5">Category 5</option>
            </Select>
            <p className="text-xs text-muted-foreground">
              Select the expense category
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">Expense Level (1-10)</Label>
            <Select
              id="level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              required
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num.toString()}>
                  Level {num}
                </option>
              ))}
            </Select>
            <p className="text-xs text-muted-foreground">
              Select the expense level
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="emotion">Emotion Correlation (1-5)</Label>
            <Select
              id="emotion"
              value={emotion}
              onChange={(e) => setEmotion(e.target.value)}
              required
            >
              <option value="1">Emotion 1</option>
              <option value="2">Emotion 2</option>
              <option value="3">Emotion 3</option>
              <option value="4">Emotion 4</option>
              <option value="5">Emotion 5</option>
            </Select>
            <p className="text-xs text-muted-foreground">
              Select the emotion correlation
            </p>
          </div>

          {message && (
            <div className={`rounded-lg p-4 ${
              message.includes("Error") || message.includes("Missing")
                ? "bg-destructive/10 border border-destructive/20"
                : "bg-muted/50"
            }`}>
              <p className={`text-sm ${
                message.includes("Error") || message.includes("Missing")
                  ? "text-destructive"
                  : "text-foreground"
              }`}>{message}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || !isConnected}
            className="w-full gap-2"
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Encrypting & Adding...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                {isConnected ? "Add Encrypted Entry" : "Connect Wallet First"}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpenseEntryForm;

