import { useEffect, useCallback, useState, useRef } from "react";
import axios from "axios";
import useWeb3 from "../hooks/useWeb3";

function NFTTest() {
  const web3 = useWeb3();
  const [humans, setHumans] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/humans").then((result) => {
      setHumans(result?.data?.data);
    });
  }, []);

  const mint = useCallback(async () => {
    await window.ethereum.enable();

    const accounts = await web3.getAccounts();
    const number = Math.floor(Math.random() * 10000);

    web3.humanContract.methods
      .mint(
        accounts[0],
        `Eunha &${number}`,
        `My Name is Eunha &${number}`,
        "hashhashhashhashhashhashhashhashhash"
      )
      .send({ from: accounts[0] })
      .on("receipt", (result) => {
        console.log("mintTo result => ", result);
      })
      .on("error", (err) => {
        console.log("mintTo error => ", err);
      });
  }, [web3]);

  const getMetadata = async () => {
    const accounts = await web3.getAccounts();
    console.log(`account() => ${accounts[0]}`);

    web3.humanContract.methods
      .name()
      .call()
      .then((result) => console.log(`name() => ${result}`));

    web3.humanContract.methods
      .symbol()
      .call()
      .then((result) => console.log(`symbol() => ${result}`));

    web3.humanContract.methods
      .owner()
      .call()
      .then((result) => console.log(`owner() => ${result}`));
  };

  const getTotalSupply = () => {
    web3.humanContract.methods
      .totalSupply()
      .call()
      .then((result) => {
        console.log(`TotalSupply => `, result);
      });
  };

  const balanceOf = async () => {
    const accounts = await web3.web3js.eth.getAccounts();
    console.log(accounts[0]);

    web3.humanContract.methods
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
    const accounts = await web3.web3js.eth.getAccounts();
    const balance = await web3.humanContract.methods
      .balanceOf(accounts[0])
      .call();

    console.log(`balanceOf(${accounts[0]}) => ${balance}`);

    for (let i = 0; i < balance; i++) {
      const token = await web3.humanContract.methods
        .tokenOfOwnerByIndex(accounts[0], i)
        .call();
      console.log(`token(${i}) => `, token);
    }
  };

  return (
    <div style={{ padding: 50 }}>
      <h1>NFT Test</h1>
      <button onClick={getMetadata}>getMetadata</button>
      <button onClick={mint}>mint</button>
      <button onClick={getTotalSupply}>Total Supply</button>
      <button onClick={balanceOf}>balanceOf Me</button>
      <button onClick={getMyTokens}>getMyTokens</button>
      <div className="Human" style={{ display: "flex" }}>
        {humans.map((item, index) => (
          <div key={index}>
            <h3>#{item.tokenId}</h3>
            <div>{item.name}</div>
          </div>
        ))}
        <div></div>
      </div>
    </div>
  );
}

export default NFTTest;
