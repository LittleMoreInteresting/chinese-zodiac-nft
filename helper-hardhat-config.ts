import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

export const networkConfig:{ [key: number|string]: any } = {
    default: {
        name: "hardhat",
        keepersUpdateInterval: "30",
    },
    31337: {
        name: "localhost",
        subscriptionId: process.env.SUB_ID,
        gasLane:
            "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c", // 30 gwei
        keepersUpdateInterval: "30",
        callbackGasLimit: "500000", // 500,000 gas
        vrfCoordinatorV2: "0x8103b0a8a00be2ddc778e6e7eaa21791cd364625",
        jobId: process.env.JOB_ID,
        oracleAddress: process.env.ORACLE_ADDRESS,
        linkTokenAddress: "0x779877a7b0d9e8603169ddbd7836e478b4624789",
        upkeepperRegistryAddress: "0xE16Df59B887e3Caa439E0b29B42bA2e7976FD8b2",
    },
    11155111: {
        name: "sepolia",
        subscriptionId: process.env.SUB_ID,
        gasLane:
            "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c", // 30 gwei
        keepersUpdateInterval: "30",
        callbackGasLimit: "500000", // 500,000 gas
        vrfCoordinatorV2: "0x8103b0a8a00be2ddc778e6e7eaa21791cd364625",
        jobId: process.env.JOB_ID,
        oracleAddress: process.env.ORACLE_ADDRESS,
        linkTokenAddress: "0x779877a7b0d9e8603169ddbd7836e478b4624789",
        upkeepperRegistryAddress: "0xE16Df59B887e3Caa439E0b29B42bA2e7976FD8b2",
    },
    1: {
        name: "mainnet",
        keepersUpdateInterval: "30",
    },
} as const

export const developmentChains = ["hardhat", "localhost"]
export const VERIFICATION_BLOCK_CONFIRMATIONS = 6
// const frontEndContractsFile =
//     "../nextjs-smartcontract-lottery-fcc/constants/contractAddresses.json"
// const frontEndAbiFile = "../nextjs-smartcontract-lottery-fcc/constants/abi.json"

export default {
    networkConfig,
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
    // frontEndContractsFile,
    // frontEndAbiFile,
}
