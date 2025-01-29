import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "./ui/card";

interface HistoricalDataPoint {
  date: string;
  rate: number;
}

// Simulated historical data - in production, this would come from an API
const generateHistoricalData = (): HistoricalDataPoint[] => {
  const data: HistoricalDataPoint[] = [];
  const startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
  
  for (let i = 0; i < 12; i++) {
    const currentDate = new Date(startDate);
    currentDate.setMonth(startDate.getMonth() + i);
    data.push({
      date: currentDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      rate: 4 + Math.random() * 2, // Random rate between 4-6%
    });
  }
  
  return data;
};

export const HistoricalYieldChart = () => {
  const data = generateHistoricalData();

  return (
    <Card className="p-6 bg-gradient-to-br from-gray-900/95 to-gray-800/95 border-gray-700 animate-fade-in">
      <h3 className="text-lg font-semibold text-white mb-4">Historical sBTC Yield Rates</h3>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value.toFixed(1)}%`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const value = payload[0].value;
                  const formattedValue = typeof value === 'number' ? value.toFixed(2) : value;
                  return (
                    <div className="bg-gray-800/95 backdrop-blur-sm border border-gray-700 p-2 rounded-lg shadow-xl">
                      <p className="text-white font-mono">
                        {payload[0].payload.date}: {formattedValue}%
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="#F7931A"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#F7931A" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};