import { useState} from "react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Button } from "../components/ui/button";
import { Bitcoin, Share2 } from "lucide-react";
import { YieldChart } from "./YieldChart";
import { HistoricalYieldChart } from "./HistoricalYieldChart";
import { YieldComparison } from "./YieldComparison";
import { RiskWarningDialog } from "./RiskWarningDialog";
import { toast } from "sonner";
import { fetchBTCPrice, fetchSBTCYieldRate } from "../lib/api";
import { useQuery } from "@tanstack/react-query";

export const YieldCalculator = () => {
  const [btcAmount, setBtcAmount] = useState<string>("");
  const [duration, setDuration] = useState<string>("3");

  // Fetch BTC price
  const { data: btcPrice } = useQuery({
    queryKey: ["btcPrice"],
    queryFn: fetchBTCPrice,
    refetchInterval: 60000, // Refetch every minute
  });

  // Fetch sBTC yield rate
  const { data: yieldRate } = useQuery({
    queryKey: ["sbtcYieldRate"],
    queryFn: fetchSBTCYieldRate,
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  const calculateYield = (amount: number, months: number) => {
    const yearFraction = months / 12;
    return amount * (yieldRate || 0.05) * yearFraction;
  };

  const handleBtcInputChange = (value: string) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setBtcAmount(value);
      if (value && parseFloat(value) > 100000) {
        toast.warning("That's a lot of Bitcoin! Are you Satoshi? 😉");
      }
    }
  };

  const handleShare = async (platform?: 'twitter' | 'reddit') => {
    const totalYield = btcAmount ? calculateYield(parseFloat(btcAmount), parseInt(duration)) : 0;
    const totalValue = btcAmount ? parseFloat(btcAmount) + totalYield : 0;
    
    const shareText = `I just simulated stacking #Bitcoin with #sBTC!\n\n` +
      `Initial: ₿${parseFloat(btcAmount).toFixed(8)}\n` +
      `Duration: ${duration} months\n` +
      `Yield: ₿${totalYield.toFixed(8)}\n` +
      `Total: ₿${totalValue.toFixed(8)}\n\n` +
      `Calculate your potential yield at ${window.location.href}`;

    if (platform === 'twitter') {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
      window.open(twitterUrl, '_blank');
      return;
    }

    if (platform === 'reddit') {
      const redditUrl = `https://reddit.com/submit?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent('Check out my Bitcoin stacking simulation!')}`;
      window.open(redditUrl, '_blank');
      return;
    }

    try {
      await navigator.clipboard.writeText(shareText);
      toast.success("Results copied to clipboard! Share it with your friends!");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Failed to copy results to clipboard");
    }
  };

  const totalYield = btcAmount ? calculateYield(parseFloat(btcAmount), parseInt(duration)) : 0;
  const totalValue = btcAmount ? parseFloat(btcAmount) + totalYield : 0;
  const usdValue = btcPrice ? parseFloat(btcAmount || "0") * btcPrice : 0;

  return (
    <Card className="w-full max-w-4xl p-6 bg-gradient-to-br from-gray-900/95 to-gray-800/95 border-gray-700">
      <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
  <div className="flex items-center gap-2">
    <Bitcoin className="w-8 h-8 text-btc-orange" />
    <h2 className="text-xl md:text-2xl font-bold text-white">sBTC Yield</h2>
  </div>
  <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
    <RiskWarningDialog />
    {btcAmount && (
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          className="gap-2 text-gray-200 border-gray-700 hover:bg-gray-800"
          onClick={() => handleShare()}
        >
          <Share2 className="w-4 h-4" />
          Copy
        </Button>
        <Button
          variant="outline"
          className="gap-2 text-gray-200 border-gray-700 hover:bg-gray-800"
          onClick={() => handleShare('twitter')}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Share on X
        </Button>
        <Button
          variant="outline"
          className="gap-2 text-gray-200 border-gray-700 hover:bg-gray-800"
          onClick={() => handleShare('reddit')}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
          </svg>
          Share on Reddit
        </Button>
      </div>
    )}
       </div>
     </div>


        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <Label htmlFor="btc-amount" className="text-gray-200">
                BTC Amount
              </Label>
              <div className="relative">
                <Input
                  id="btc-amount"
                  type="text"
                  value={btcAmount}
                  onChange={(e) => handleBtcInputChange(e.target.value)}
                  className="pl-8 bg-gray-800 border-gray-700 text-white font-mono"
                  placeholder="0.00"
                />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">₿</span>
              </div>
              {btcPrice && btcAmount && (
                <p className="text-sm text-gray-400 mt-1">
                  ≈ ${usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} USD
                </p>
              )}
            </div>

            <div>
              <Label className="text-gray-200">Lock Duration</Label>
              <RadioGroup
                value={duration}
                onValueChange={setDuration}
                className="grid grid-cols-2 gap-4 mt-2"
              >
                <Label
                  htmlFor="1m"
                  className={`flex items-center justify-center p-3 rounded-lg border ${
                    duration === "1"
                      ? "bg-btc-orange/20 border-btc-orange text-btc-orange"
                      : "bg-gray-800 border-gray-700 text-gray-300"
                  } cursor-pointer transition-colors`}
                >
                  <RadioGroupItem value="1" id="1m" className="sr-only" />
                  1 Month
                </Label>
                <Label
                  htmlFor="3m"
                  className={`flex items-center justify-center p-3 rounded-lg border ${
                    duration === "3"
                      ? "bg-btc-orange/20 border-btc-orange text-btc-orange"
                      : "bg-gray-800 border-gray-700 text-gray-300"
                  } cursor-pointer transition-colors`}
                >
                  <RadioGroupItem value="3" id="3m" className="sr-only" />
                  3 Months
                </Label>
                <Label
                  htmlFor="6m"
                  className={`flex items-center justify-center p-3 rounded-lg border ${
                    duration === "6"
                      ? "bg-btc-orange/20 border-btc-orange text-btc-orange"
                      : "bg-gray-800 border-gray-700 text-gray-300"
                  } cursor-pointer transition-colors`}
                >
                  <RadioGroupItem value="6" id="6m" className="sr-only" />
                  6 Months
                </Label>
                <Label
                  htmlFor="12m"
                  className={`flex items-center justify-center p-3 rounded-lg border ${
                    duration === "12"
                      ? "bg-btc-orange/20 border-btc-orange text-btc-orange"
                      : "bg-gray-800 border-gray-700 text-gray-300"
                  } cursor-pointer transition-colors`}
                >
                  <RadioGroupItem value="12" id="12m" className="sr-only" />
                  12 Months
                </Label>
              </RadioGroup>
              {yieldRate && (
                <p className="text-sm text-gray-400 mt-2">
                  Current APY: {(yieldRate * 100).toFixed(2)}%
                </p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <YieldChart
              initialAmount={parseFloat(btcAmount) || 0}
              yieldAmount={totalYield}
              duration={parseInt(duration)}
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                <p className="text-sm text-gray-400">Yield Earned</p>
                <p className="text-base sm:text-xl font-mono text-btc-orange mt-1 break-all">
                  ₿ {totalYield.toFixed(8)}
                </p>
                {btcPrice && (
                  <p className="text-xs sm:text-sm text-gray-400 mt-1 break-words">
                    ≈ ${(totalYield * btcPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })} USD
                  </p>
                )}
              </div>
              <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                <p className="text-sm text-gray-400">Total Value</p>
                <p className="text-base sm:text-xl font-mono text-white mt-1 break-all">
                  ₿ {totalValue.toFixed(8)}
                </p>
                {btcPrice && (
                  <p className="text-xs sm:text-sm text-gray-400 mt-1 break-words">
                    ≈ ${(totalValue * btcPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })} USD
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <HistoricalYieldChart />
        <YieldComparison />
      </div>
    </Card>
  );
};
