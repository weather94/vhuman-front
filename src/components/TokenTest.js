import { useEffect, useCallback, useState, useRef } from "react";
import axios from "axios";
import useWeb3 from "../hooks/useWeb3";

function NFTTest() {
  const web3 = useWeb3();
  const [balance, setBalance] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);

  useEffect(() => {
    if (web3) {
      web3.humanContract.events.Mint().on("data", function (event) {
        let data = event.returnValues;
        console.log("web3.humanContract.events.Mint() => ", data);
      });
      getMyBalance();
    }
  }, [web3]);

  const refresh = useCallback(() => {
    getMyBalance();
    getTotalSupply();
  }, [web3]);

  const getMyBalance = useCallback(async () => {
    const account = (await web3.getAccounts())[0];
    web3.tokenContract.methods
      .balanceOf(account)
      .call()
      .then((result) => {
        console.log(result);
        setBalance(result);
      });
  }, [web3]);

  const getTotalSupply = useCallback(async () => {
    const account = (await web3.getAccounts())[0];
    web3.tokenContract.methods
      .totalSupply()
      .call()
      .then((result) => {
        console.log(result);
        setTotalSupply(result);
      });
  }, [web3]);

  return (
    <div style={{ padding: 50 }}>
      <h1>ERC20 Test</h1>
      <button onClick={refresh}>refresh</button>
      {/* <button onClick={getTotalSupply}>Total Supply</button>
      <button onClick={balanceOf}>balanceOf Me</button>
      <button onClick={getMyTokens}>getMyTokens</button> */}
      <h3> total supply: {balance / 10 ** 18} BB</h3>
      <h3> my balance: {balance / 10 ** 18} BB</h3>
    </div>
  );
}

export default NFTTest;
