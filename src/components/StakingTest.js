import { useEffect, useCallback, useState, useRef } from "react";
import axios from "axios";
import useWeb3 from "../hooks/useWeb3";

const STATUS = {
  WAIT: "0",
  CONVERT: "1",
  SUCCESS: "2",
  CANCEL: "3",
  ERROR: "4",
  COMPLAIN: "5",
  END: "6",
};

const STATUS_TO_STRING = {
  0: "WAIT",
  1: "CONVERT",
  2: "SUCCESS",
  3: "CANCEL",
  4: "ERROR",
  5: "COMPLAIN",
  6: "END",
};

function StakingTest() {
  const [humans, setHumans] = useState([]);
  const [stakingHumans, setStakingHumans] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const web3 = useWeb3();
  const text = useRef();

  useEffect(() => {
    if (web3) {
      getMyStakingTokens();
      getMyTokens();
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

  const stake = useCallback(
    async (tokenId) => {
      const accounts = await web3.getAccounts();

      let manual = prompt("수동으로 하시겠습니까? y/n");
      manual = manual === "y" || manual === "Y" ? true : false;

      web3.humanContract.methods
        .approve(web3.converterAddress, tokenId)
        .send({ from: accounts[0] })
        .on("receipt", (data) => {
          console.log("web3.humanContract.methods.approve");
          console.log(data);
          // uint _tokenId, uint fee, uint price, bool manual
          console.log(web3.converterContract.methods);
          web3.converterContract.methods
            .stake(tokenId, 50000, manual)
            .send({ from: accounts[0] })
            .on("receipt", (result) => {
              console.log("staking result => ", result);
            })
            .on("error", (err) => {
              console.log("staking error => ", err);
            });
        });
    },
    [web3]
  );

  const unstake = useCallback(
    async (tokenId) => {
      const accounts = await web3.getAccounts();

      web3.converterContract.methods
        .unstake(tokenId)
        .send({ from: accounts[0] })
        .on("receipt", (result) => {
          console.log("staking result => ", result);
        })
        .on("error", (err) => {
          console.log("staking error => ", err);
        });
    },
    [web3]
  );

  const withdraw = useCallback(
    async (tokenId) => {
      const accounts = await web3.getAccounts();
      const value = prompt("출금할 금액을 입력해주세요");
      if (value) {
        web3.converterContract.methods
          .withdraw(tokenId, value)
          .send({ from: accounts[0] })
          .on("receipt", (result) => {
            console.log("withdraw result => ", result);
          })
          .on("error", (err) => {
            console.log("withdraw error => ", err);
          });
      }
    },
    [web3]
  );

  const success = useCallback(
    async (requestId) => {
      const accounts = await web3.getAccounts();
      const resultUri = prompt("결과 URI 를 입력하세요");
      if (resultUri) {
        web3.converterContract.methods
          .success(requestId, resultUri)
          .send({ from: accounts[0] })
          .on("receipt", (result) => {
            console.log("success result => ", result);
          })
          .on("error", (err) => {
            console.log("success error => ", err);
          });
      }
    },
    [web3]
  );

  const allow = useCallback(
    async (requestId) => {
      const accounts = await web3.getAccounts();
      web3.converterContract.methods
        .allow(requestId)
        .send({ from: accounts[0] })
        .on("receipt", (result) => {
          console.log("confirm result => ", result);
        })
        .on("error", (err) => {
          console.log("confirm error => ", err);
        });
    },
    [web3]
  );

  const confirm = useCallback(
    async (requestId) => {
      const accounts = await web3.getAccounts();
      web3.converterContract.methods
        .confirm(requestId)
        .send({ from: accounts[0] })
        .on("receipt", (result) => {
          console.log("confirm result => ", result);
        })
        .on("error", (err) => {
          console.log("confirm error => ", err);
        });
    },
    [web3]
  );

  const complain = useCallback(
    async (requestId) => {
      const accounts = await web3.getAccounts();
      web3.converterContract.methods
        .complain(requestId)
        .send({ from: accounts[0] })
        .on("receipt", (result) => {
          console.log("complain result => ", result);
        })
        .on("error", (err) => {
          console.log("complain error => ", err);
        });
    },
    [web3]
  );

  const getMyTokens = async () => {
    const tokenIds = [];
    const accounts = await web3.web3js.eth.getAccounts();
    const balance = await web3.humanContract.methods
      .balanceOf(accounts[0])
      .call();

    for (let i = 0; i < balance; i++) {
      const token = await web3.humanContract.methods
        .tokenOfOwnerByIndex(accounts[0], i)
        .call();
      console.log(`token(${i}) => `, token);
      tokenIds.push(token);
    }
    console.log(`tokenIds => `, tokenIds);

    axios
      .get("http://localhost:3000/humans", { params: { ids: tokenIds } })
      .then((result) => {
        setHumans(result?.data?.data);
      });
  };

  const getMyStakingTokens = async () => {
    const tokenIds = [];
    const accounts = await web3.web3js.eth.getAccounts();
    const balance = await web3.shumanContract.methods
      .balanceOf(accounts[0])
      .call();
    console.log(balance);
    for (let i = 0; i < balance; i++) {
      const token = await web3.shumanContract.methods
        .tokenOfOwnerByIndex(accounts[0], i)
        .call();
      console.log(`token(${i}) => `, token);
      tokenIds.push(token);
    }

    if (tokenIds.length > 0) {
      axios
        .get("http://localhost:3000/humans", { params: { ids: tokenIds } })
        .then((result) => {
          console.log(result);
          setStakingHumans(result?.data?.data);
        });
    }
  };

  return (
    <div style={{ padding: 50 }}>
      <h1>Staking Test</h1>
      <h2>My Staking Tokens</h2>
      <div className="Human" style={{ display: "flex" }}>
        {stakingHumans.map((item, index) => (
          <div key={index}>
            <h3>#{item.tokenId}</h3>
            <div>{item.name}</div>
            <div>fee: {item.fee}</div>
            <div>balance: {item.balance}</div>
            <div>allow: {item.manual ? "manual" : "auto"}</div>
            <button onClick={() => unstake(item.tokenId)}>unstake</button>
            <button onClick={() => withdraw(item.tokenId)}>withdraw</button>
            {item.requests.map((request, _index) => {
              return (
                <div key={_index}>
                  <div>
                    {request.sourceUri} ({`${STATUS_TO_STRING[request.status]}`}
                    )
                  </div>
                  <div>
                    {!request.allowed && (
                      <button onClick={() => allow(request.requestId)}>
                        allow
                      </button>
                    )}
                    {request.status === STATUS.WAIT && request.allowed && (
                      <button onClick={() => success(request.requestId)}>
                        success
                      </button>
                    )}
                    {request.status === STATUS.SUCCESS && (
                      <>
                        <button onClick={() => confirm(request.requestId)}>
                          confirm
                        </button>
                        <button onClick={() => complain(request.requestId)}>
                          complain
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div></div>
      </div>
      <h2>My Tokens</h2>
      <div className="Human" style={{ display: "flex" }}>
        {humans.map((item, index) => (
          <div key={index}>
            <h3>#{item.tokenId}</h3>
            <div>{item.name}</div>
            <button onClick={() => stake(item.tokenId)}>stake</button>
          </div>
        ))}
        <div></div>
      </div>
    </div>
  );
}

export default StakingTest;
