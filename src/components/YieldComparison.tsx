import { Card } from "./ui/card";

interface ComparisonItem {
  name: string;
  apy: number;
  risk: "Low" | "Medium" | "High";
  description: string;
}

const comparisonData: ComparisonItem[] = [
  {
    name: "Traditional Savings Account",
    apy: 0.5,
    risk: "Low",
    description: "FDIC-insured bank savings accounts with minimal risk"
  },
  {
    name: "Certificate of Deposit",
    apy: 2.5,
    risk: "Low",
    description: "Time-locked bank deposits with fixed returns"
  },
  {
    name: "USDC Lending",
    apy: 3.5,
    risk: "Medium",
    description: "Stablecoin lending through DeFi protocols"
  },
  {
    name: "sBTC Stacking",
    apy: 5.0,
    risk: "High",
    description: "Bitcoin yield through Stacks protocol stacking"
  }
];

export const YieldComparison = () => {
  return (
    <Card className="p-6 bg-gradient-to-br from-gray-900/95 to-gray-800/95 border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Yield Comparison</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {comparisonData.map((item) => (
          <div
            key={item.name}
            className="p-4 rounded-lg bg-gray-800/50 border border-gray-700"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-white">{item.name}</h4>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  item.risk === "Low"
                    ? "bg-green-500/20 text-green-400"
                    : item.risk === "Medium"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {item.risk} Risk
              </span>
            </div>
            <p className="text-2xl font-mono text-btc-orange mb-2">
              {item.apy.toFixed(1)}% APY
            </p>
            <p className="text-sm text-gray-400">{item.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};