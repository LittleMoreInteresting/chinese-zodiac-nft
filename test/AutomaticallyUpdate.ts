import { assert, expect }  from "chai"
import { BigNumberish, ContractEvent, ContractTransaction } from "ethers"
import {
    loadFixture,
    time,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { network,ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

describe("Automatically Tests", function () {
    async function deployAutomaticallyFixture() {
        // 用户地址
        const accounts = await ethers.getSigners()
        const deployer = accounts[0]
        const minter = accounts[1]
        // Gas常量
       const preMintFee = ethers.parseEther("0.0001")
       const mintFee = ethers.parseEther("0.0005")
       // 部署Mock
       const BASE_FEE = "100000000000000000"
        const GAS_PRICE_LINK = "1000000000" // 0.000000001 LINK per gas

        const chainId = 31337

        const VRFCoordinatorV2MockFactory = await ethers.getContractFactory(
            "VRFCoordinatorV2Mock"
        )
        const VRFCoordinatorV2Mock = await VRFCoordinatorV2MockFactory.deploy(
            BASE_FEE,
            GAS_PRICE_LINK
        )

        const fundAmount = "1000000000000000000"
        const transaction = await VRFCoordinatorV2Mock.createSubscription()
        const transactionReceipt = await transaction.wait(1)
        
        const subscriptionId = transactionReceipt?.logs[0].topics[1] as string
        await VRFCoordinatorV2Mock.fundSubscription(subscriptionId, fundAmount)

        const _VRFADDRESS = VRFCoordinatorV2Mock.getAddress()
        const _keyHash = "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c"
            
       // 部署合约
       const _maxNumberOftoken = 10
       const ZodiacContract = await ethers.getContractFactory("ChineseZodiac")
       const heroes = await ZodiacContract.connect(deployer).deploy(
            _maxNumberOftoken,
            subscriptionId,
            _VRFADDRESS,
            _keyHash
        )
        // 添加 consumer
        await VRFCoordinatorV2Mock.addConsumer(subscriptionId,heroes.getAddress())

        const mintTx = await  heroes.connect(minter).mint({
            value: mintFee,
        })
        const txReceipt = await mintTx.wait(1)

        const requestId = txReceipt?.logs[2].topics[1] as string
        console.log("requestId= ", requestId.toString())
        await new Promise(async (resolve, reject) => {
            try {
                await VRFCoordinatorV2Mock.fulfillRandomWords(
                    requestId,
                    heroes.getAddress(),
                )
                resolve("");
            } catch (e) {
                reject(e)
            }
        })
        // Automation
        const AUTOMATION = await ethers.getContractFactory(
            "AutomaticallyUpdateMode"
        )
        const auto = await AUTOMATION.connect(deployer).deploy(heroes.getAddress())
        return {
            deployer,
            minter,
            auto,
            heroes,
        }
    }

    describe("constructor", function () {
        it("initializes the Automatically correctly", async () => {
            const { auto } = await loadFixture(deployAutomaticallyFixture);
            const counter = (
                await auto.counter()
            ).toString()
            assert.equal(counter, "0")
        })
    })

    describe("checkUpkeep", async function () {
        it("should be able to call checkUpkeep", async function () {
            const { auto } = await loadFixture(deployAutomaticallyFixture);
            const checkData = ethers.keccak256(
                ethers.toUtf8Bytes(""),
            )
            const { upkeepNeeded } =
                await auto.checkUpkeep(
                    checkData,
                )
            assert.equal(upkeepNeeded, false)
        })
    })

    describe("#performUpkeep", async function () {
        describe("success", async function () {
            it("should be able to call performUpkeep after time passes", async function () {
                const { auto } = await loadFixture(deployAutomaticallyFixture);
                const startingCount =
                    await auto.counter()

                const checkData = ethers.keccak256(
                    ethers.toUtf8Bytes(""),
                )
                const interval =
                    await auto.interval()
                await time.increase(interval + BigInt(1))
                await auto.performUpkeep(
                    checkData,
                )
                const counter =
                    await auto.counter()
                assert.equal(startingCount + BigInt(1), counter)
            })
        })
    })
})