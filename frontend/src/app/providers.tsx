'use client';

import * as React from 'react';
import {NextUIProvider} from "@nextui-org/react";
import {useRouter} from 'next/navigation'
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets';
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider,State,cookieStorage, createStorage } from 'wagmi';
const { wallets } = getDefaultWallets();
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string;
const config = getDefaultConfig({
  appName: 'CZ-NFT',
  projectId: projectId,
  wallets: [
    ...wallets,
    {
      groupName: 'Other',
      wallets: [argentWallet, trustWallet, ledgerWallet],
    },
  ],
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    sepolia,
  ],
  ssr: true,
  storage: createStorage({
    key:"cz-nft",
    storage: cookieStorage,
})
});

const queryClient = new QueryClient();

export function Providers({ children,initialState }: { children: React.ReactNode,initialState?: State }) {
    const router = useRouter()
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
        <NextUIProvider navigate={router.push}>
                        {children}
                    </NextUIProvider>   
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}