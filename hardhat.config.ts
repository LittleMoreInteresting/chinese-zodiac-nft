import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();
const SEPOLIA_RPC_URL =
    process.env.SEPOLIA_RPC_URL ||
    "https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY"
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "ETHERSCAN_API_KEY"
const INFURA_API_KEY = process.env.INFURA_API_KEY;
const config: HardhatUserConfig = {
  solidity: {
    compilers: [
        {version: "0.8.24"},
        {version: "0.8.19"}
    ]
  },
  etherscan: {
    apiKey: {
      sepolia:ETHERSCAN_API_KEY
    }
  },
  networks:{
    hardhat:{
      chainId: 31337,
      allowUnlimitedContractSize: true,
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 11155111,
    },
  }
};

export default config;
