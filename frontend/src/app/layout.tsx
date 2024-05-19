import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
import { headers } from 'next/headers'
import "./globals.css";
import {Providers} from "./providers";
import {
  cookieToInitialState,
} from 'wagmi'
import { wagmiConfig } from "@/app/wagmiConfig"
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chinese Zodiac NFT",
  description: "Chinese Zodiac NFT app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(
    wagmiConfig,
    headers().get('cookie')
)
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers  initialState={initialState}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
