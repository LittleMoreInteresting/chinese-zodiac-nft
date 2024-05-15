import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { network,ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();
import {networkConfig} from "../../helper-hardhat-config";
const chainId = network.config.chainId??31337
const config = networkConfig[chainId]
const _maxNumberOftoken = 10000
const _keyHash = config["gasLane"] ||
            "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc"
const vrfCoordinatorV2Address = config["vrfCoordinatorV2"]
const subscriptionId = config["subscriptionId"]
const ChineseZodiacModule = buildModule("ChineseZodiacModule", (m) => {
    console.log( [
        _maxNumberOftoken,
        subscriptionId,
        vrfCoordinatorV2Address,
        _keyHash
    ])
    const chineseZodiac = m.contract("ChineseZodiac", [
        _maxNumberOftoken,
        subscriptionId,
        vrfCoordinatorV2Address,
        _keyHash
    ]);
  
    return { chineseZodiac: chineseZodiac };
  });
  
  export default ChineseZodiacModule;