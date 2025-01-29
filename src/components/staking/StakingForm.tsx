import { useState } from "react";

import { Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface StakingFormProps {
  onSubmit: (amount: number, cycles: number) => Promise<void>;
  minAmount: number;
  isLoading: boolean;
}

export const StakingForm = ({ onSubmit, minAmount, isLoading }: StakingFormProps) => {
  const [stxAmount, setStxAmount] = useState("");
  const [cycles, setCycles] = useState("12");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(stxAmount);
    const cycleCount = Number(cycles);
    await onSubmit(amount, cycleCount);
    setStxAmount("");
    setCycles("12");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-purple-200 mb-2">
          Amount to Stake (STX)
        </label>
        <Input
          type="number"
          value={stxAmount}
          onChange={(e) => setStxAmount(e.target.value)}
          placeholder={`Minimum ${(minAmount / 1000000).toLocaleString()} STX`}
          className="bg-purple-800/50 border-purple-700 text-white"
          disabled={isLoading}
          min="0"
          step="any"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-purple-200 mb-2">
          Number of Cycles
        </label>
        <Input
          type="number"
          value={cycles}
          onChange={(e) => setCycles(e.target.value)}
          placeholder="Enter number of cycles (1-12)"
          className="bg-purple-800/50 border-purple-700 text-white"
          disabled={isLoading}
          min="1"
          max="12"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-purple-600 hover:bg-purple-500 text-white"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          "Start Stacking"
        )}
      </Button>
    </form>
  );
};