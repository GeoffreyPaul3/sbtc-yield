import { useState } from "react";
import { Card } from "../components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { StakingInfo } from "./staking/StakingInfo";
import { StakingForm } from "./staking/StakingForm";
import { initiateStacking } from "../utils/stacks";

interface StakingInfo {
  current_cycle: {
    id: number;
    min_threshold_ustx: number;
  };
  total_ustx_stacked: number;
  reward_slots: number;
  next_reward_cycle_in: number;
}

const fetchStakingInfo = async (): Promise<StakingInfo> => {
  const response = await fetch('https://stacks-node-api.mainnet.stacks.co/v2/pox');
  if (!response.ok) {
    throw new Error('Failed to fetch staking information');
  }
  return await response.json();
};

export const StacksStaking = () => {
  const [isStaking, setIsStaking] = useState(false);

  const { data: stakingInfo, isLoading, error } = useQuery({
    queryKey: ["staking-info"],
    queryFn: fetchStakingInfo,
    refetchInterval: 30000,
    meta: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSettled: ( error: any) => {
        if (error) {
          toast.error("Failed to fetch staking information");
        }
      }
    }
  });

  const handleStake = async (amount: number, cycles: number) => {
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid STX amount");
      return;
    }

    if (!cycles || cycles < 1 || cycles > 12) {
      toast.error("Please enter a valid number of cycles (1-12)");
      return;
    }

    const minAmount = stakingInfo?.current_cycle.min_threshold_ustx 
      ? stakingInfo.current_cycle.min_threshold_ustx / 1000000 
      : 0;

    if (amount < minAmount) {
      toast.error(`Minimum staking amount is ${minAmount.toLocaleString()} STX`);
      return;
    }

    setIsStaking(true);
    try {
      const txId = await initiateStacking(amount, cycles);
      toast.success(`Staking transaction submitted! Transaction ID: ${txId}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to initiate staking");
    } finally {
      setIsStaking(false);
    }
  };

  if (error) {
    return (
      <Card className="w-full p-4 sm:p-6 bg-gradient-to-br from-red-900/95 to-red-800/95 border-red-700">
        <div className="text-red-200">
          Failed to load staking information. Please try again later.
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full p-4 sm:p-6 bg-gradient-to-br from-purple-900/95 to-purple-800/95 border-purple-700">
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="flex items-center gap-2">
          <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-white">Stacks Staking</h2>
        </div>

        <StakingInfo 
          totalStacked={stakingInfo?.total_ustx_stacked || 0}
          minThreshold={stakingInfo?.current_cycle.min_threshold_ustx || 0}
          isLoading={isLoading}
        />

        <StakingForm 
          onSubmit={handleStake}
          minAmount={stakingInfo?.current_cycle.min_threshold_ustx || 0}
          isLoading={isStaking || isLoading}
        />

        <div className="text-sm text-purple-200">
          <p>Note: Stacking requires a minimum amount of STX and locks your tokens for the selected number of cycles. Each cycle is approximately 2 weeks long.</p>
        </div>
      </div>
    </Card>
  );
};