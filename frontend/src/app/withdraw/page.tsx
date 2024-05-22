'use client'
import {Button, Card,CardFooter,CardBody} from "@nextui-org/react";
import React, {useState, useEffect, useRef, cache} from "react";
import {
    useAccount,
    useChainId,
    type BaseError,
    useWriteContract
  } from "wagmi";
  import { formatEther } from "viem"
import { readContract,waitForTransactionReceipt,getBalance } from '@wagmi/core'
import {wagmiContractConfig } from "@/app/utils/wagmiContractConfig"
import { wagmiConfig } from "@/app/wagmiConfig"
import { toast } from 'sonner'

export default function Withdraw(){
    const { address,isConnected } = useAccount();
    const chainId = useChainId();
    const [balance,setBalance] = useState("0")
    const getAccountBalance = async ()=>{
        const balance = await getBalance(wagmiConfig, {
            address: wagmiContractConfig.address,
            unit: 'ether', 
        })
        setBalance(formatEther(balance.value))
    }
    useEffect(()=>{
        if(isConnected){
          getAccountBalance()
        }
    },[address, chainId])

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
                    getAccountBalance()
                    toast.success("mint success !!!")
                }
            }
        }
    })
    if (error) {
        toast.error("Error: "+((error as BaseError).shortMessage || error.message))
    }
    async function withdraw() {
        if (!isConnected){
            toast.error("Not connected.")
            return
        }
        writeContract({
          ...wagmiContractConfig,
          functionName: 'withdraw',
          args: [],
          account:address,
        })
    }


    return(<>
        <div className="flex flex-col items-center justify-between p-15 ">
            <Card className="col-span-12 w-[300px] h-[350px] bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">
                <CardBody>
                    Proceeds: 
                    <div className="justify-center text-2xl text-center m-auto w-[150px] h-[200px]">{balance} ETH</div>
                </CardBody>
            <CardFooter className="absolute bg-black/60 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
                <Button onClick={withdraw} isLoading={isPending}>Withdraw</Button>
            </CardFooter>
            </Card>
        </div>
    </>)
}