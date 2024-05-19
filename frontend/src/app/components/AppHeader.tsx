'use client'
import React from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@nextui-org/react";
import Link  from "next/link"
import { ConnectButton } from "@rainbow-me/rainbowkit";
export default function AppHeader() {
    return (
      <div className="container bg-gradient-to-r from-cyan-500 to-blue-500 m-5 rounded-lg">
    <Navbar >
      <NavbarBrand>
      <Link href="/" ><p className="font-bold text-inherit">Chinese Zodiac</p></Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <NavbarItem isActive>
        {/* <Link href="/" >
            Home
          </Link> */}
        </NavbarItem>
        <NavbarItem>
          {/* <Link href="#" aria-current="page">
            About
          </Link> */}
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
            <ConnectButton/>
        </NavbarItem>
      </NavbarContent>
    </Navbar></div>
    );
}