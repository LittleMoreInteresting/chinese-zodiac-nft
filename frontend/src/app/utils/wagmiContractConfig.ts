import { nftAbi } from "@/constants/ChineseZodiac.abi"

const addr = process.env.NEXT_PUBLIC_CONTRACT_ADDR as string
export const wagmiContractConfig = {
    address:addr as `0x${string}`,
    abi:nftAbi
}
