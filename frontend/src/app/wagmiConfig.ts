import {cookieStorage, createConfig, createStorage, http} from "wagmi";
import {sepolia} from "wagmi/chains";

const httpSepolia = process.env.NEXT_ALCHEMY_HTTP_SEPOLIA as string
export const wagmiConfig = createConfig({
    chains: [sepolia],
    ssr: true,
    storage: createStorage({
        key:"nft-market",
        storage: cookieStorage,
    }),
    transports:{
        [sepolia.id]: http(httpSepolia),
    },
})

