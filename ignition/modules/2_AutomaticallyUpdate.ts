import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const _zodAddress = "0xA1BC62a07494763Ecf80E081e98354c2833d2D40";
const AutomaticallyUpdateModule = buildModule("AutomaticallyUpdateMode",(m) => {
    const automaticallyUpdate = m.contract("AutomaticallyUpdateMode", [
        _zodAddress,
    ]);
    return { automaticallyUpdate: automaticallyUpdate };
});

export default AutomaticallyUpdateModule;