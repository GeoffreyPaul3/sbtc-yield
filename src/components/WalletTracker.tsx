"use client"

import { useState } from "react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Wallet, ArrowRight, Lock, Loader } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { StacksStaking } from "./StacksStaking";

interface WalletData {
  balance: number;
  totalReceived: number;
  totalSent: number;
  txCount: number;
}

const isValidBitcoinAddress = (address: string): boolean => {
  const legacyFormat = /^[1][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  const segwitFormat = /^[3][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  const nativeSegwitFormat = /^bc1[a-zA-HJ-NP-Z0-9]{39,59}$/;
  return legacyFormat.test(address) || segwitFormat.test(address) || nativeSegwitFormat.test(address);
};

const fetchWalletData = async (address: string): Promise<WalletData> => {
  if (!address) throw new Error("No address provided");
  if (!isValidBitcoinAddress(address)) throw new Error("Invalid Bitcoin address format");

  const [dataResponse, txResponse] = await Promise.all([
    fetch(`https://blockstream.info/api/address/${address}`),
    fetch(`https://blockstream.info/api/address/${address}/txs`),
  ]);

  if (!dataResponse.ok || !txResponse.ok) {
    throw new Error("Failed to fetch wallet data. Please check the address and try again.");
  }

  const [data, txData] = await Promise.all([dataResponse.json(), txResponse.json()]);

  let totalReceived = 0;
  let totalSent = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  txData.forEach((tx: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tx.vout.forEach((output: any) => {
      if (output.scriptpubkey_address === address) {
        totalReceived += output.value;
      }
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tx.vin.forEach((input: any) => {
      if (input.prevout.scriptpubkey_address === address) {
        totalSent += input.prevout.value;
      }
    });
  });

  return {
    balance: data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum,
    totalReceived: totalReceived / 1e8, // Convert satoshis to BTC
    totalSent: totalSent / 1e8, // Convert satoshis to BTC
    txCount: data.chain_stats.tx_count,
  };
};

export const WalletTracker = () => {
  const [address, setAddress] = useState("");
  const [activeAddress, setActiveAddress] = useState("");
  const [showStaking, setShowStaking] = useState(false);

  const { data: walletData, isLoading, error } = useQuery({
    queryKey: ["wallet", activeAddress],
    queryFn: () => fetchWalletData(activeAddress),
    enabled: !!activeAddress,
    retry: 2,
    meta: {
      onSettled: (error: Error | null) => {
        if (error) {
          toast.error(error.message);
        }
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      toast.error("Please enter a wallet address");
      return;
    }
    if (!isValidBitcoinAddress(address)) {
      toast.error("Invalid Bitcoin address format");
      return;
    }
    setActiveAddress(address);
  };

  return (
    <div className="space-y-4">
      <Card className="w-full p-4 sm:p-6 bg-gradient-to-br from-gray-900/95 to-gray-800/95 border-gray-700">
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-btc-orange" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">BTC Wallet Tracker</h2>
            </div>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setShowStaking(!showStaking)}
            >
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">Stacks Staking</span>
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter BTC wallet address"
              className="flex-1 bg-gray-800 border-gray-700 text-white text-sm sm:text-base"
            />
            <Button
              type="submit"
              className="bg-btc-orange hover:bg-btc-light text-white w-full sm:w-auto"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </Button>
          </form>

          {error && (
            <div className="p-4 rounded-lg bg-red-900/20 border border-red-700/50 text-red-200 text-sm">
              {error.message}
            </div>
          )}

          {isLoading && (
            <div className="flex justify-center items-center p-4">
              <Loader className="w-6 h-6 animate-spin text-btc-orange" />
            </div>
          )}

          {walletData && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                <p className="text-xs sm:text-sm text-gray-400">Current Balance</p>
                <p className="text-base sm:text-xl font-mono text-btc-orange mt-1 break-all">
                  ₿ {walletData.balance.toFixed(8)}
                </p>
              </div>
              <div className="p-3 sm:p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                <p className="text-xs sm:text-sm text-gray-400">Transaction Count</p>
                <p className="text-base sm:text-xl font-mono text-white mt-1">
                  {walletData.txCount.toLocaleString()}
                </p>
              </div>
              <div className="p-3 sm:p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                <p className="text-xs sm:text-sm text-gray-400">Total Received</p>
                <p className="text-base sm:text-xl font-mono text-green-500 mt-1 break-all">
                  ₿ {walletData.totalReceived.toFixed(8)}
                </p>
              </div>
              <div className="p-3 sm:p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                <p className="text-xs sm:text-sm text-gray-400">Total Sent</p>
                <p className="text-base sm:text-xl font-mono text-red-500 mt-1 break-all">
                  ₿ {walletData.totalSent.toFixed(8)}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {showStaking && <StacksStaking />}
    </div>
  );
};