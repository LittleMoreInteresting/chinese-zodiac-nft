import { assert, expect }  from "chai"
import { BigNumberish, ContractEvent, ContractTransaction } from "ethers"
import {
    loadFixture,
    time,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { network,ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

describe("Zodiac Tests", function () {
    async function deployZodiacFixture() {
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
        VRFCoordinatorV2Mock.addConsumer(subscriptionId,heroes.getAddress())
        
        return {
            deployer,
            minter,
            preMintFee,
            mintFee,
            ZodiacContract,
            heroes,
            _maxNumberOftoken,
            accounts,
            VRFCoordinatorV2Mock
        }
    }

    describe("constructor", function () {
        it("initializes the models correctly", async () => {
            const { heroes, } = await loadFixture(deployZodiacFixture);
            expect(await heroes.totalSupply()).to.equal(0);
            expect(await heroes.getMaxNumberOftoken()).to.equal(10);
        })
    })


    describe("fulfillRandomWords", function () {
        
        it("can only be called after mint", async () => {
            const { heroes,VRFCoordinatorV2Mock } = await loadFixture(deployZodiacFixture);
            await expect(
                VRFCoordinatorV2Mock.fulfillRandomWords(
                    0,
                    heroes.getAddress(),
                ), // reverts if not fulfilled
            ).to.be.revertedWith("nonexistent request")
        })

        //prmint an erc721
        //listening requestId via event MintRequest
        //accord requestId to call fulfillRandomWords function
        it("call back after mint a NTF then checks if success for creating a NFT ", async () => {
            const { heroes,deployer,mintFee,minter,VRFCoordinatorV2Mock } = await loadFixture(deployZodiacFixture);

            const mintTx = await  heroes.connect(minter).mint({
                value: mintFee,
            })
            const txReceipt = await mintTx.wait(1)

            const requestId = txReceipt?.logs[2].topics[1] as string

            console.log("requestId= ", requestId.toString())
            // This will be more important for our staging tests...
            await new Promise(async (resolve, reject) => {
                // event listener for MintSuccess
                const eventMintSuccess = heroes.getEvent("MintSuccess")
                heroes.once(eventMintSuccess, async (requestId, event) => {
                    console.log("MintSuccess event fired!")
                    console.log("requestId = ", requestId.toString())
                    // assert throws an error if it fails, so we need to wrap it in a try/catch so that the promise returns event if it fails.
                    try {
                        const totalSupply = (
                            await heroes.totalSupply()
                        ).toString()
                        assert.equal(totalSupply, "1")
                        const balanceOf = (
                            await heroes.balanceOf(
                                minter.address,
                            )
                        ).toString()
                        assert.equal(balanceOf, "1")
                        resolve("") // if try passes, resolves the promise
                    } catch (e) {
                        reject(e) // if try fails, rejects the promise
                    }
                })

                try {
                    await VRFCoordinatorV2Mock.fulfillRandomWords(
                        requestId,
                        heroes.getAddress(),
                    )
                } catch (e) {
                    reject(e)
                }
            })

             // get tokenID 
             const tokenID = await heroes.connect(minter).getTokenId()
             // get metadata
             const tokenUri = await heroes.tokenURI(tokenID)
             console.log(tokenID,tokenUri)
             console.log(await heroes.getAddress())
            
        })
    })

    describe("replaceMint", function (){
        it("replaceMint",async function(){
            const { heroes,deployer,mintFee,minter,preMintFee,VRFCoordinatorV2Mock } = await loadFixture(deployZodiacFixture);
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
            // get tokenID 
            const tokenID = await heroes.connect(minter).getTokenId()
            // get metadata
            const tokenUri = await heroes.tokenURI(tokenID)
            console.log(tokenID,tokenUri)

            // add one day
            const tomorrow = new Date().setTime(new Date().getTime() + 86400);
            await time.increaseTo(tomorrow)

            const replaceMintTx = await  heroes.connect(minter).replaceMint({
                value: preMintFee,
            })
            const replaceTxReceipt = await replaceMintTx.wait(1)
            const requestId2 = replaceTxReceipt?.logs[1].topics[1] as string
            console.log("requestId2= ", requestId2.toString())
            await new Promise(async (resolve, reject) => {
                try {
                    await VRFCoordinatorV2Mock.fulfillRandomWords(
                        requestId2,
                        heroes.getAddress(),
                    )
                    resolve("");
                } catch (e) {
                    reject(e)
                }
            })
             // get metadata
             const tokenUri2 = await heroes.tokenURI(tokenID)
             console.log(tokenID,tokenUri2)
        })
    })

    describe("changeNFTStatus",function(){
        // TODO 
        it("changeNFTStatus",async function(){
            const { heroes,deployer,mintFee,minter,preMintFee,VRFCoordinatorV2Mock } = await loadFixture(deployZodiacFixture);
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
            // get tokenID 
            const tokenID = await heroes.connect(minter).getTokenId()
            // get metadata
            const tokenUri = await heroes.tokenURI(tokenID)
            console.log(tokenID,tokenUri)

            // add hafe day
            const tomorrow = new Date().setTime(new Date().getTime()+ 12*3600*1000);
            await time.increaseTo(tomorrow)
            await heroes.changeNFTStatus()
            // get metadata
            const tokenUriNew = await heroes.tokenURI(tokenID)
            console.log(tokenID,tokenUriNew)
        })
    })
})