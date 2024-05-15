// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// AutomationCompatible.sol imports the functions from both ./AutomationBase.sol and
// ./interfaces/AutomationCompatibleInterface.sol

import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import "./ChineseZodiac.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

contract AutomaticallyUpdateWeather is AutomationCompatibleInterface
{
    /**
     * Public counter variable
     */
    uint public counter;

    /**
     * Use an interval in seconds and a timestamp to slow execution of Upkeep
     */
    uint public immutable interval;
    uint public lastTimeStamp;
    ChineseZodiac public nftModel;

    constructor(
        address _zodAddress
    ) {
        interval = 1 hours;
        lastTimeStamp = block.timestamp;
        nftModel = ChineseZodiac(_zodAddress);
    }

    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData )
    {
        upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
        performData = "";
        // upkeepNeeded = true;
        // We don't use the checkData in this example. The checkData is defined when the Upkeep was registered.
    }

    function performUpkeep(bytes calldata ) external override {
        //We highly recommend revalidating the upkeep in the performUpkeep function
        if ((block.timestamp - lastTimeStamp) > interval) {
            lastTimeStamp = block.timestamp;
            nftModel.changeNFTStatus();
            counter++;
        }
    }
}
