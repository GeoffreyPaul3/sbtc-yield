import { Coins, Lock } from "lucide-react";

interface StakingInfoProps {
  totalStacked: number;
  minThreshold: number;
  isLoading: boolean;
}

export const StakingInfo = ({ totalStacked, minThreshold, isLoading }: StakingInfoProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="p-4 rounded-lg bg-purple-800/50 border border-purple-700">
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-purple-400" />
          <p className="text-sm text-purple-200">Total STX Stacked</p>
        </div>
        <p className="text-xl font-mono text-white mt-2">
          {isLoading ? "Loading..." : `${(totalStacked / 1000000).toLocaleString()} STX`}
        </p>
      </div>
      
      <div className="p-4 rounded-lg bg-purple-800/50 border border-purple-700">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-purple-400" />
          <p className="text-sm text-purple-200">Minimum Stacking Amount</p>
        </div>
        <p className="text-xl font-mono text-white mt-2">
          {isLoading ? "Loading..." : `${(minThreshold / 1000000).toLocaleString()} STX`}
        </p>
      </div>
    </div>
  );
};