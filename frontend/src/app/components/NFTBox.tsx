'use client'
import {Image} from "@nextui-org/image";
import {Button, Card,CardFooter,CardBody} from "@nextui-org/react";
import React, {useState, useEffect, useRef, cache} from "react";
import {
  useAccount,
  useChainId,
  type BaseError,
  useWriteContract
} from "wagmi";
import { readContract,waitForTransactionReceipt } from '@wagmi/core'
import { toast } from 'sonner'
import { parseEther } from "viem/utils";

import {wagmiContractConfig } from "@/app/utils/wagmiContractConfig"
import { wagmiConfig } from "@/app/wagmiConfig"

export default function NFTBox() {
    const list = [
        {
          title: "Rat",
          img: "/images/1.png",
          
        },
        {
          title: "Ox",
          img: "/images/2.png",
          
        },
        {
          title: "Tiger",
          img: "/images/3.png",
          
        },
        {
          title: "Rabbit",
          img: "/images/4.png",
          
        },
        {
          title: "Chinese loong",
          img: "/images/5.png",
          
        },
        {
          title: "Snake",
          img: "/images/6.png",
          
        },
        {
          title: "Horse",
          img: "/images/7.png",
          
        },
        {
          title: "Goat",
          img: "/images/8.png",
          
        },
        {
            title: "Monkey",
            img: "/images/9.png",
            
          },
          {
            title: "Rooster",
            img: "/images/10.png",
            
          },
          {
            title: "Dog",
            img: "/images/11.png",
            
          },
          {
            title: "Pig",
            img: "/images/12.png",
            
          },
      ];
    const { address,isConnected } = useAccount();
    const chainId = useChainId();
    const [minted,setMinted] = useState(false)
    const [name,setName] = useState("NFT")
    const [image,setImage] = useState("/chinese-2417918_640.jpg")
    const [desc,setDesc] = useState("Get Your Chinese Zodiac NFT")

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
            }
        }
    }
})
if (errorReplace) {
    toast.error("Error: "+((errorReplace as BaseError).shortMessage || errorReplace.message))
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

 

  useEffect(()=>{
    if(isConnected){
      getAccountBalance()
    }
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