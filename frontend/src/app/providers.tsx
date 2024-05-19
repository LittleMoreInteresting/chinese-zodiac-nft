"use client";

import React, { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
    State,
    WagmiProvider,
} from 'wagmi'
import {
    getDefaultConfig,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit';

import {NextUIProvider} from "@nextui-org/react";
import {useRouter} from 'next/navigation'

import { wagmiConfig} from "./wagmiConfig"
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string;
export const config = getDefaultConfig({
    appName: "App",
    projectId:projectId,
    ...wagmiConfig
})
// Setup queryClient
const queryClient = new QueryClient()

export function Providers({children,initialState}: {
    children: ReactNode
    initialState?: State
}) {
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
    )
}