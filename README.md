# sBTC Yield - Yield Simulation App

Welcome to the **sBTC Yield** project! This is a decentralized finance (DeFi) yield simulation app where users can input different amounts of **BTC** to see how much yield they would earn if they converted it into **sBTC**. The app allows users to explore different scenarios based on deposit amounts, durations, and yield rates, while staying informed with the latest **Bitcoin news** and tracking their **Stacks Stacking**.

## Features

- **BTC to sBTC Yield Simulation**:  
  Users can input different amounts of **BTC** to simulate potential yields when converted into **sBTC** based on various deposit amounts, durations, and yield rates.
  
- **Stacks Stacking Integration**:  
  Supports Stacks Stacking, allowing users to see staking opportunities and potential rewards for their **sBTC** holdings.

- **Bitcoin News Feed**:  
  Stay updated with real-time Bitcoin news fetched from various sources like **CryptoCompare** and **CoinGecko** to keep users informed about market trends.

- **Multi-API Support**:  
  Integrates with multiple APIs (CoinGecko, CoinCap, Binance) to ensure reliable fetching of BTC prices and other relevant data, with fallback mechanisms for API errors.

- **Real-Time Yield Estimator**:  
  Provides an accurate and dynamic yield estimator that adapts based on real-time data, ensuring a reliable simulation of BTC yields over time.

## Technologies Used

- **Frontend**:  
  - React.js (with hooks and functional components)
  - Tailwind CSS for styling
  - TypeScript for type safety
  - Vite for fast and optimized development builds

- **Backend**:  
  - Node.js for server-side logic (using server actions)
  - APIs: CoinGecko, CryptoCompare, Binance, and custom backend for yield simulation calculations
  - Stacks API for Stacks Staking functionality

- **Others**:  
  - Bitcoin News API integration
  - Caching mechanisms to ensure smooth performance under heavy loads
  - Error handling to ensure app stability during API failures or rate limiting
