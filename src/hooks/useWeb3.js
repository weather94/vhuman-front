import { useEffect, useState } from "react";
import Web3 from "../singleton/web3";

function useWeb3() {
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    setWeb3(Web3.getInstance());
  }, []);

  return web3;
}

export default useWeb3;
