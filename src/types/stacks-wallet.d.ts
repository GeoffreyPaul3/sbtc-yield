interface StacksProvider {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request: (method: string, params?: any) => Promise<any>;
  getAddresses: () => Promise<string[]>;
}

interface Window {
  LeatherProvider?: StacksProvider;
}