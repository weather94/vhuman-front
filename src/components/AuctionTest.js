import { useEffect, useCallback, useState, useRef } from "react";
import axios from "axios";
import useWeb3 from "../hooks/useWeb3";

function AuctionTest() {
  const [auctions, setAuctions] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const web3 = useWeb3();
  const text = useRef();

  useEffect(() => {
    setCurrentTime(new Date().toLocaleString());
    axios.get("http://localhost:3000/auctions").then((result) => {
      setAuctions(result?.data?.data);
    });
  }, []);

  useEffect(() => {
    if (web3) {
      console.log("contract 있음! AddAuction");
      web3.auctionContract.events.AddAuction().on("data", function (event) {
        let data = event.returnValues;
        console.log("web3.auctionContract.events.AddAuction() => ", data);
      });

      web3.auctionContract.events.AddBid().on("data", function (event) {
        let data = event.returnValues;
        console.log("web3.auctionContract.events.AddBid() => ", data);
      });

      web3.auctionContract.events.Execute().on("data", function (event) {
        let data = event.returnValues;
        console.log("web3.auctionContract.events.Execute() => ", data);
      });
    }
  }, [web3]);

  const addAuction = useCallback(async () => {
    const accounts = await web3.getAccounts();
    web3.humanContract.methods
      .approve(web3.auctionAddress, text.current)
      .send({ from: accounts[0] })
      .on("receipt", (data) => {
        console.log("web3.humanContract.methods.approve");
        console.log(data);
        web3.auctionContract.methods
          .addAuction(
            text.current,
            Math.floor(
              new Date(new Date().getTime() + 30 * 1000).getTime() / 1000
            )
          )
          .send({ from: accounts[0] })
          .on("receipt", (result) => {
            console.log("addAuction result => ", result);
          })
          .on("error", (err) => {
            console.log("addAuction error => ", err);
          });
      });
  }, [web3]);

  const addBid = useCallback(
    async (tokenId) => {
      const accounts = await web3.getAccounts();
      const result = prompt("금액을 입력해주세요");
      if (result) {
        const balance = web3.utils.toWei(`${result}`, "ether");
        web3.tokenContract.methods
          .approve(web3.auctionAddress, balance)
          .send({ from: accounts[0] })
          .on("receipt", (data) => {
            console.log("web3.tokenContract.methods.approve");
            console.log(data);
            web3.auctionContract.methods
              .bid(tokenId, balance)
              .send({ from: accounts[0] })
              .on("receipt", (result) => {
                console.log("addBid result => ", result);
              })
              .on("error", (err) => {
                console.log("addBid error => ", err);
              });
          });
      }
    },
    [web3]
  );

  const execute = useCallback(
    async (tokenId) => {
      const accounts = await web3.getAccounts();
      web3.auctionContract.methods
        .execute(tokenId)
        .send({ from: accounts[0] })
        .on("receipt", (result) => {
          console.log("execute result => ", result);
        })
        .on("error", (err) => {
          console.log("execute error => ", err);
        });
    },
    [web3]
  );

  return (
    <div style={{ padding: 50 }}>
      <h1>Auction Test</h1>
      <h3>{currentTime}</h3>
      <input
        type="text"
        onChange={(event) => {
          text.current = event.target.value;
        }}
      />
      <button onClick={addAuction}>addAuction</button>
      <div className="Human" style={{ display: "flex" }}>
        {auctions.map((item, index) => (
          <div key={index} style={{ padding: 20 }}>
            <h3>#{item.tokenId}</h3>
            <button
              onClick={() => addBid(item.tokenId)}
              disabled={item.executed}
            >
              bid
            </button>
            <div>{new Date(item.deadline * 1000).toLocaleString()}</div>
            <button
              onClick={() => execute(item.tokenId)}
              disabled={item.executed}
            >
              execute
            </button>
            {item.bids.map((_item, _index) => (
              <div key={_index}>
                {new Date(_item.time * 1000).toLocaleString()} ---{" "}
                {_item.balance / 10 ** 18} bb
              </div>
            ))}
          </div>
        ))}
        <div></div>
      </div>
    </div>
  );
}

export default AuctionTest;
