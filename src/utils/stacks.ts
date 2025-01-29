interface TransactionResult {
  txId: string;
  // Add other properties if known
}

export const checkWalletConnection = async (): Promise<string | null> => {
  try {
    if (!window.LeatherProvider) {
      throw new Error(
        "Leather wallet not detected. Please install Leather wallet."
      );
    }

    const addresses = await window.LeatherProvider.getAddresses();
    if (!addresses || addresses.length === 0) {
      throw new Error(
        "No Stacks address found. Please connect your Leather wallet."
      );
    }

    return addresses[0];
  } catch (error) {
    console.error("Wallet connection error:", error);
    throw error;
  }
};

export const initiateStacking = async (
  amount: number,
  cycles: number
): Promise<string> => {
  const userAddress = await checkWalletConnection();
  console.log("User address:", userAddress); // Example usage

  // Convert STX amount to microSTX (1 STX = 1,000,000 microSTX)
  const amountInMicroStx = BigInt(Math.floor(amount * 1000000));

  const functionArgs = [
    {
      type: "uint128",
      value: amountInMicroStx.toString(),
    },
    {
      type: "uint128",
      value: cycles.toString(),
    },
  ];

  try {
    const txOptions = {
      contractAddress: "SP000000000000000000002Q6VF78",
      contractName: "pox-3",
      functionName: "stack-stx",
      functionArgs,
      postConditions: [],
      network: "mainnet",
      attachment: "",
      onFinish: (result: TransactionResult) => {
        console.log("Transaction:", result);
        return result.txId;
      },
    };

    const result = await window.LeatherProvider?.request(
      "stacks-contract-call",
      txOptions
    );
    return result.txId;
  } catch (error) {
    console.error("Stacking error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to initiate stacking"
    );
  }
};
