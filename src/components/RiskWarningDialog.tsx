import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { Button } from "../components/ui/button";
import { AlertTriangle } from "lucide-react";

export const RiskWarningDialog = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="gap-2 text-yellow-400 border-yellow-400/20 hover:bg-yellow-400/10 text-sm sm:text-base whitespace-normal h-auto py-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          Important Risk Information
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-gray-900 border-gray-700 w-[95vw] max-w-lg mx-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white text-lg sm:text-xl">Understanding DeFi Yield Risks</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4 text-gray-300 text-sm sm:text-base">
            <p>
              Before participating in sBTC stacking, please understand the following risks:
            </p>
            <ul className="list-disc pl-4 space-y-2">
              <li>
                <strong>Smart Contract Risk:</strong> sBTC relies on smart contracts that could potentially have vulnerabilities.
              </li>
              <li>
                <strong>Market Volatility:</strong> Bitcoin's price fluctuations can affect the USD value of your yields.
              </li>
              <li>
                <strong>Protocol Risk:</strong> The Stacks blockchain and sBTC protocol may experience technical issues.
              </li>
              <li>
                <strong>Regulatory Risk:</strong> Changes in regulations could impact sBTC stacking operations.
              </li>
            </ul>
            <p className="mt-4">
              Always do your own research and never invest more than you can afford to lose.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:space-x-2">
          <AlertDialogCancel className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 text-sm sm:text-base">
            Close
          </AlertDialogCancel>
          <AlertDialogAction className="bg-btc-orange hover:bg-btc-orange/90 text-sm sm:text-base">
            I Understand
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
