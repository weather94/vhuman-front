import _Web3 from "web3";

import HumanABI from "../assets/abi/Human.json";
import SHumanERC721ABI from "../assets/abi/SHumanERC721.json";
import AuctionABI from "../assets/abi/HumanAuction.json";
import TokenABI from "../assets/abi/HumanERC20.json";
import ConverterABI from "../assets/abi/HumanConverter.json";

class Web3 {
  static instance;
  web3js;
  humanContract;
  auctionContract;
  tokenContract;
  utils = _Web3.utils;

  humanAddress = "0x69cD9841c6Aa81691f46b64A51E0f8b426035662";
  shumanAddress = "0x1994531153071763EE86083d6e6343B9d4A34aA9";
  auctionAddress = "0x3641033a73b50193A2E4C4f03f5183fCF2FD4999";
  tokenAddress = "0x4c7d30B2Ab739E69791da9dAE5f2538F762F964F";
  converterAddress = "0x52Bf4824041Bf8cEb63d951DA6eDd28531A7fdf6";

  constructor() {
    console.log("!!! CREATE SINGLETON WEB3 !!!");
    if (typeof window.web3 !== "undefined") {
      this.web3js = new _Web3(window.web3.currentProvider);
      console.log("metamask on!");
    } else {
      this.web3js = new _Web3(
        new _Web3.providers.WebsocketProvider("wss://mainnet.infura.io/ws")
      );
      console.log("metamask off!");
    }

    this.humanContract = new this.web3js.eth.Contract(
      HumanABI.abi,
      this.humanAddress
    );
    this.shumanContract = new this.web3js.eth.Contract(
      SHumanERC721ABI.abi,
      this.shumanAddress
    );
    this.auctionContract = new this.web3js.eth.Contract(
      AuctionABI.abi,
      this.auctionAddress
    );
    this.tokenContract = new this.web3js.eth.Contract(
      TokenABI.abi,
      this.tokenAddress
    );
    this.converterContract = new this.web3js.eth.Contract(
      ConverterABI.abi,
      this.converterAddress
    );
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    } else {
      this.instance = new Web3();
      return this.instance;
    }
  }

  async getAccounts() {
    return await this.web3js.eth.getAccounts();
  }
}

export default Web3;
