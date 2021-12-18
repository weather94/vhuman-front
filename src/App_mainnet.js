import logo from "./logo.svg";
import Web3 from "web3";
import "./App.css";
import { useEffect, useCallback } from "react";
import HumanABI from "./assets/abi/Human.json";

const humanContract = "0x744d24b9bE846c3fd5666e382C1D9D69b4EF0244";

function App() {
  useEffect(() => {
    console.log(HumanABI);
    if (typeof window.web3 !== "undefined") {
      global.web3js = new Web3(window.web3.currentProvider);
      console.log("metamask on!");
    } else {
      global.web3js = new Web3(
        new Web3.providers.WebsocketProvider("wss://mainnet.infura.io/ws")
      );
      console.log("metamask off!");
    }
    global.contract = new global.web3js.eth.Contract(
      HumanABI.abi,
      humanContract
    );
  }, []);

  const test = () => {
    global.contract.methods
      .name()
      .call()
      .then((result) => console.log(`name() => ${result}`));

    global.contract.methods
      .symbol()
      .call()
      .then((result) => console.log(`symbol() => ${result}`));
  };

  const mint = useCallback(async () => {
    await window.ethereum.enable();

    const accounts = await global.web3js.eth.getAccounts();

    global.contract.methods
      .mintTo(accounts[0])
      .send({ from: accounts[0] })
      .on("receipt", (result) => {
        console.log("mintTo result => ", result);
      })
      .on("error", (err) => {
        console.log("mintTo error => ", err);
      });
  }, []);

  const getTotalSupply = () => {
    global.contract.methods
      .totalSupply()
      .call()
      .then((result) => {
        console.log(`TotalSupply => `, result);
      });
  };

  const balanceOf = async () => {
    const accounts = await global.web3js.eth.getAccounts();
    console.log(accounts[0]);

    global.contract.methods
      .balanceOf(accounts[0])
      .call()
      .then((result) => {
        console.log(`balanceOf accounts[0] => `, result);
      })
      .catch((err) => {
        console.log(`error => `, err);
      });
  };

  const getMyTokens = async () => {
    const accounts = await global.web3js.eth.getAccounts();
    const balance = await global.contract.methods.balanceOf(accounts[0]).call();
    console.log(`balanceOf(${accounts[0]}) => ${balance}`);
    for (let i = 0; i < balance; i++) {
      const token = await global.contract.methods
        .tokenOfOwnerByIndex(accounts[0], i)
        .call();
      console.log(`token(${i}) => `, token);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={test}>test</button>
        <button onClick={mint}>mint</button>
        <button onClick={getTotalSupply}>Total Supply</button>
        <button onClick={balanceOf}>balanceOf Me</button>
        <button onClick={getMyTokens}>getMyTokens</button>
      </header>
    </div>
  );
}

export default App;
