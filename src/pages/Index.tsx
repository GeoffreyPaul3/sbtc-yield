import { BitcoinNews } from "../components/BitcoinNews";
import { WalletTracker } from "../components/WalletTracker";
import { YieldCalculator } from "../components/YieldCalculator";

const Index = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-900 p-4 md:p-6 lg:p-8 gap-6 md:gap-8">
      <div className="w-full max-w-4xl overflow-hidden">
        <YieldCalculator />
      </div>
      <div className="w-full max-w-4xl overflow-hidden">
        <WalletTracker />
      </div>
      <div className="w-full max-w-4xl overflow-hidden">
        <BitcoinNews />
      </div>
    </div>
  );
};

export default Index;