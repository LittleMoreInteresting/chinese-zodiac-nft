import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { network } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();
import {networkConfig} from "../../helper-hardhat-config";
const chainId = network.config.chainId??31337
const config = networkConfig[chainId]
const _maxNumberOftoken = 10000
const _keyHash = config["gasLane"] ||
            "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae"
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