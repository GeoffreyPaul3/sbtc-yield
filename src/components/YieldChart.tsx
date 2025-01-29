import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface YieldChartProps {
  initialAmount: number;
  yieldAmount: number;
  duration: number;
}

interface ChartDataPoint {
  month: number;
  value: number;
}

export const YieldChart = ({ initialAmount, yieldAmount, duration }: YieldChartProps) => {
  const generateChartData = (): ChartDataPoint[] => {
    const data: ChartDataPoint[] = [];
    const monthlyYield = yieldAmount / duration;

    for (let i = 0; i <= duration; i++) {
      data.push({
        month: i,
        value: initialAmount + monthlyYield * i,
      });
    }
    return data;
  };

  const data = generateChartData();

  return (
    <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] mt-2 animate-fade-in">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F7931A" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#F7931A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="month"
            tickFormatter={(value) => `${value}m`}
            stroke="#666"
            tickLine={false}
            className="font-mono text-xs sm:text-sm"
          />
          <YAxis
            tickFormatter={(value) => `₿${value.toFixed(4)}`}
            stroke="#666"
            tickLine={false}
            className="font-mono text-xs sm:text-sm"
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const value = payload[0].value as number;
                return (
                  <div className="bg-gray-800/95 border border-gray-700 p-3 rounded-lg shadow-lg backdrop-blur-sm animate-scale-in">
                    <p className="text-sm text-gray-300 mb-1 font-mono">
                      Month {payload[0].payload.month}
                    </p>
                    <p className="text-sm font-mono text-btc-orange font-bold">
                      ₿ {value.toFixed(8)}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#F7931A"
            fill="url(#yieldGradient)"
            strokeWidth={2}
            className="transition-all duration-300"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};