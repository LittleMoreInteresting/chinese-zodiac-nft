'use client'
import {Image} from "@nextui-org/image";
import {Button, Card,CardFooter,CardBody,Divider} from "@nextui-org/react";
import React, {useState, useEffect, useRef, cache} from "react";
import {
  useAccount,
  useChainId,
  type BaseError,
  useWriteContract
} from "wagmi";
import {  } from '@wagmi/core'
import { 
  readContract,
  waitForTransactionReceipt,
  watchContractEvent,
  watchChainId
} from '@wagmi/core'
import { toast } from 'sonner'
import { parseEther } from "viem/utils";

import {wagmiContractConfig } from "@/app/utils/wagmiContractConfig"
import { wagmiConfig } from "@/app/wagmiConfig"
import AboutCard from "./AboutCard"

export default function NFTBox() {
    const list = [
        {
          title: "Rat",
          img: "/images/1.png",
          desc: "Intelligent, adaptable, and resourceful."
        },
        {
          title: "Ox",
          img: "/images/2.png",
          desc: "Diligent, reliable, and patient."
        },
        {
          title: "Tiger",
          img: "/images/3.png",
          desc:"Brave, confident, and powerful."
        },
        {
          title: "Rabbit",
          img: "/images/4.png",
          desc:"Gentle, kind, and peaceful."
        },
        {
          title: "Chinese loong",
          img: "/images/5.png",
          desc:"Strong, wise, and majestic."
        },
        {
          title: "Snake",
          img: "/images/6.png",
          desc:"Cunning, enigmatic, and insightful."
        },
        {
          title: "Horse",
          img: "/images/7.png",
          desc:"Free-spirited, courageous, and energetic."
        },
        {
          title: "Goat",
          img: "/images/8.png",
          desc:"Mild-mannered, kind-hearted, and compassionate."
        },
        {
          title: "Monkey",
          img: "/images/9.png",
          desc:"Clever, flexible, and playful."
        },
        {
          title: "Rooster",
          img: "/images/10.png",
          desc:"Hardworking, brave, and competitive."
        },
        {
          title: "Dog",
          img: "/images/11.png",
          desc:"Loyal, friendly, and affectionate."
        },
        {
          title: "Pig",
          img: "/images/12.png",
          desc:"Honest, tolerant, and fortunate."
        },
      ];
    const { address,isConnected } = useAccount();
    const chainId = useChainId();
    const [minted,setMinted] = useState(false)
    const [name,setName] = useState("NFT")
    const [image,setImage] = useState("/chinese-2417918_640.jpg")
    const [desc,setDesc] = useState("Get Your Chinese Zodiac NFT")
    const [TOKEN_ID,setTOKEN_ID] = useState(BigInt(0))
    const unwatch = watchChainId(wagmiConfig, {
      onChange(chainId) {
        getAccountBalance();
      },
    })
    const getAccountBalance = async ()=>{
     const balance = await  readContract(wagmiConfig,{
        ...wagmiContractConfig,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
        account:address,
      })
      if(balance && balance > 0) {
        setMinted(true);
        const tokenId = await  readContract(wagmiConfig,{
          ...wagmiContractConfig,
          functionName: 'getTokenId',
          account:address,
        })
        setTOKEN_ID(tokenId)
        await flushNFTUI(tokenId)
        return tokenId;
      }
      return BigInt(0);
    }
    const flushNFTUI = async(tokenId:bigint) => {
      const tokenURI = await  readContract(wagmiConfig,{
        ...wagmiContractConfig,
        functionName: 'tokenURI',
        args:[tokenId],
        account:address,
      })
      console.log("tokenURI",tokenURI)
      const {name:_name,image:_image,description:_description} = await nftMetadata(tokenURI);
      setName(_name);
      setImage(_image);
      setDesc(_description)
    }
    async function nftMetadata(tokenURI:string) {
      const tokenURIResponse = await (await fetch(tokenURI)).json();
      if (tokenURIResponse){
        return tokenURIResponse;
      }
      return {}
    }
    

    // Mint NFT 
  const {
      data: hash,
      error,
      isPending,
      writeContract
  } = useWriteContract({
      mutation:{
          onSuccess:async (hash, variables) => {
              if (hash){
                  toast.info("Transaction Hash:"+hash)
              }
              const listReceipt = await waitForTransactionReceipt(wagmiConfig,{
                  hash
              })
              if (listReceipt.status == "success"){
                  toast.success("mint success !!!")
                  setMinted(true)
                  await watchMintSuccess();
              }
          }
      }
  })
  if (error) {
      toast.error("Error: "+((error as BaseError).shortMessage || error.message))
  }
  async function mintNft() {
      if (!isConnected){
          toast.error("Not connected.")
          return
      }
      writeContract({
        ...wagmiContractConfig,
        functionName: 'mint',
        args: [],
        value: parseEther("0.0005")
      })
  }
  // Mint NFT End
  // Replace
  const {
    data: hashReplace,
    error:errorReplace,
    isPending:isPendingReplace,
    writeContract:writeContractReplace
} = useWriteContract({
    mutation:{
        onSuccess:async (hash, variables) => {
            if (hash){
                toast.info("Transaction Hash:"+hash)
            }
            const listReceipt = await waitForTransactionReceipt(wagmiConfig,{
                hash
            })
            if (listReceipt.status == "success"){
                toast.success("Replace success !!!")
                setMinted(true)
                await watchMintSuccess();
            }
        }
    }
})
if (errorReplace) {
    console.log(((errorReplace as BaseError).shortMessage || errorReplace.message))
    toast.error("Error:Replace once every 24h ")
}
async function ReplaceNft() {
    if (!isConnected){
        toast.error("Not connected.")
        return
    }
    writeContractReplace({
      ...wagmiContractConfig,
      functionName: 'replaceMint',
      args: [],
      value: parseEther("0.0001")
    })
}

async function watchMintSuccess() {
  const unwatch = watchContractEvent(wagmiConfig, {
    ...wagmiContractConfig,
    eventName: 'MintSuccess',
    onLogs(logs) {

      console.log(logs)
      logs.forEach(async (log) => {
        console.log(log);
        const requestId = log.args.requestId;
        const tokenId = await readContract(wagmiConfig,{
          ...wagmiContractConfig,
          functionName: 'resToToken',
          args:[requestId as bigint],
          account:address,
        })
        let userTokenId = TOKEN_ID;
        if (userTokenId == BigInt(0) ){
          userTokenId = await getAccountBalance();
        }
        console.log("userTokenId",userTokenId)
        console.log("tokenId",tokenId)
        if(tokenId == userTokenId) {
          unwatch();
          await flushNFTUI(tokenId);
        }
      })
    },
  })
}

  useEffect(()=>{
    if(isConnected){
      getAccountBalance()
    }
    setMinted(false);
    setName("CZ");
    setImage("/chinese-2417918_640.jpg");
    setDesc("Get Your Chinese Zodiac NFT")
  },[address, chainId])
    return(
    <div className="container">
        <div className="flex flex-wrap gap-4" >
            <div className="justify-center">
                <Card className="col-span-12 sm:col-span-4 h-[500px]">
                    <Image 
                        className="m-2"
                        width={450}
                        isZoomed
                        alt="NextUI hero Image"
                        src={image}
                    />
                    <CardFooter className="absolute bg-black/60 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
                    <h2 className="text-white mr-2">{name}</h2>
                    <p className="text-white text-tiny">{desc}</p>
                    </CardFooter>
                </Card>
                <div className="flex m-5 justify-center">
                  <div className="mr-5">
                  <Button onClick={mintNft} isLoading={isPending} isDisabled={minted} radius="full" className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg">
                      Mint NFT <span>0.0005 ETH</span>
                  </Button>
                  </div>
                  <div>
                      <Button onClick={ReplaceNft} isLoading={isPendingReplace} isDisabled={!minted} radius="full" className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg">
                          Replace <span>0.0001 ETH</span>
                      </Button>
                  </div>                
                </div>
                <Divider />
                <AboutCard />
            </div>
            <div className="grow flex flex-col">
                <div className="gap-2 grid grid-cols-3 sm:grid-cols-4">
                {list.map((item, index) => (
                    <Card  key={index} isPressable onPress={() => console.log("item pressed")}>
                    <CardBody className="overflow-visible p-0">

                        <Image
                        alt={item.title}
                        className="w-full object-cover h-[140px]"
                        src={item.img}
                        />
                        <p className="m-2 max-w-[220px]">{item.desc.split(",").map((w,i) => ( <><span>{w}</span><br /></> ))}</p>
                    </CardBody>
                    <CardFooter className="text-small justify-between">
                        <b>{item.title}</b>
                    </CardFooter>
                    </Card>
                ))}
                </div>
            </div>
        
        </div>
    </div>

    )
}