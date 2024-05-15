import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { network,ethers } from "hardhat";
import { automaticallyUpdateModeSol } from "../../typechain-types/contracts";

const _zodAddress = "";
const AutomaticallyUpdateModule = buildModule("AutomaticallyUpdateModel",(m) => {
    const automaticallyUpdate = m.contract("AutomaticallyUpdateModel", [
        _zodAddress,
    ]);
    return { automaticallyUpdate: automaticallyUpdate };
});

export default AutomaticallyUpdateModule;