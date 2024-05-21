import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const _zodAddress = "0xb9bF68d089A013b3BD96Cca947C870C1e7164597";
const AutomaticallyUpdateModule = buildModule("AutomaticallyUpdateMode",(m) => {
    const automaticallyUpdate = m.contract("AutomaticallyUpdateMode", [
        _zodAddress,
    ]);
    return { automaticallyUpdate: automaticallyUpdate };
});

export default AutomaticallyUpdateModule;