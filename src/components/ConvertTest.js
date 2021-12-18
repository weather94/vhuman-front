import { useEffect, useCallback, useState, useRef } from "react";
import axios from "axios";
import useWeb3 from "../hooks/useWeb3";

function ConvertTest() {
  const [humans, setHumans] = useState([]);
  const [stakingHumans, setStakingHumans] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const web3 = useWeb3();
  const text = useRef();

  useEffect(() => {}, []);

  useEffect(() => {
    if (web3) {
      getAllStakingTokens();
      web3.converterContract.events.AddRequest().on("data", function (event) {
        let data = event.returnValues;
        console.log("web3.converterContract.events.AddRequest() => ", data);
      });
    }
  }, [web3]);

  const convert = useCallback(
    async (human) => {
      const accounts = await web3.getAccounts();

      //uint _tokenId, string memory _sourceUri, address _converter, string memory _humanNumber

      web3.tokenContract.methods
        .approve(web3.converterAddress, human.fee)
        .send({ from: accounts[0] })
        .on("receipt", (data) => {
          console.log("web3.tokenContract.methods.approve");
          console.log(data);
          console.log({
            1: human.tokenId,
            2: `http://video.test.com/${Math.floor(Math.random() * 100000000)}`,
            3: web3.converterAddress,
            4: "3",
          });
          web3.converterContract.methods
            .request(
              human.tokenId,
              `http://video.test.com/${Math.floor(Math.random() * 100000000)}`,
              accounts[0],
              "3"
            )
            .send({ from: accounts[0] })
            .on("receipt", (result) => {
              console.log("request result => ", result);
            })
            .on("error", (err) => {
              console.log("request error => ", err);
            });
        });
    },
    [web3]
  );

  const getAllStakingTokens = async () => {
    axios
      .get("http://localhost:3000/humans", { params: { staked: true } })
      .then((result) => {
        console.log(result);
        setStakingHumans(result?.data?.data);
      });
  };

  return (
    <div style={{ padding: 50 }}>
      <h1>Convert Test</h1>
      <h2>All Staking Tokens</h2>
      <div className="Human" style={{ display: "flex" }}>
        {stakingHumans.map((item, index) => (
          <div key={index}>
            <h3>#{item.tokenId}</h3>
            <div>{item.name}</div>
            <div>fee: {item.fee}</div>
            <div>balance: {item.balance}</div>
            <div>allow: {item.manual ? "manual" : "auto"}</div>
            <button onClick={() => convert(item)}>convert</button>
          </div>
        ))}
        <div></div>
      </div>
    </div>
  );
}

export default ConvertTest;
