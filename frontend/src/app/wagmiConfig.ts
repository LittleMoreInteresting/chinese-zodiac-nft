import {cookieStorage, createConfig, createStorage, http} from "wagmi";
import {sepolia,mainnet,
    polygon,
    optimism,
    arbitrum,
    base} from "wagmi/chains";

const httpSepolia = process.env.NEXT_ALCHEMY_HTTP_SEPOLIA as string
export const wagmiConfig = createConfig({
    chains: [sepolia,mainnet, polygon, optimism, arbitrum, base],
    ssr: true,
    storage: createStorage({
        key:"nft-market",
        storage: cookieStorage,
    }),
    transports:{
        [sepolia.id]: http(httpSepolia),
        [mainnet.id]: http(),
        [polygon.id]: http(),
        [optimism.id]: http(),
        [arbitrum.id]: http(),
        [base.id]: http(),
    },
})

