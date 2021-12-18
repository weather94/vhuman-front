import { useEffect, useCallback, useState } from "react";

import useWeb3 from "./hooks/useWeb3";

import AuctionTest from "./components/AuctionTest";
import StakingTest from "./components/StakingTest";
import NFTTest from "./components/NFTTest";
import TokenTest from "./components/TokenTest";
import ConvertTest from "./components/ConvertTest";

function App() {
  return (
    <div className="App">
      <div>
        <TokenTest />
        <NFTTest />
        <ConvertTest />
        <StakingTest />
        <AuctionTest />
      </div>
    </div>
  );
}

export default App;
