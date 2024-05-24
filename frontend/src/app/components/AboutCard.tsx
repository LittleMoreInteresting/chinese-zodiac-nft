import {Button, Card,CardHeader,CardFooter,CardBody,Avatar,Link,Chip} from "@nextui-org/react";

export default function AboutCard() {

    return(
    <Card className="mt-5 max-w-[450px]">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Avatar isBordered radius="full" size="md" src="/github-mark.svg" />
          <div className="flex flex-col gap-1 items-start justify-center">
            <Link isBlock isExternal showAnchorIcon href="https://github.com/LittleMoreInteresting/chinese-zodiac-nft" color="foreground">
            <h3 className="text-lg font-semibold leading-none text-default-600">chinese-zodiac-nft</h3>
            </Link>
            
          </div>
        </div>
        <Button
          className="bg-transparent text-foreground border-default-200" 
          color="primary"
          radius="full"
          size="sm"
          variant="solid"
          onPress={() => {}}
        >
        </Button>
      </CardHeader>
      <CardBody className="px-3 text-small text-default-400">
        <p className="pt-2 px-2">
          * Everyone can mint an NFT.<span className="py-2" aria-label="computer" role="img">💻</span>
        </p>
        <p className="pt-2 px-2">* You can perform an update once per day. <span className="py-2" aria-label="computer" role="img">🕤</span></p>
        <p className="pt-2 px-2">* Switch modes automatically based on time.<span className="py-2" aria-label="computer" role="img">🌄</span> </p>
        <div className="flex gap-4 p-2 m-2">
            <Chip size="sm">Solidity</Chip>
            <Chip size="sm">Chainlink VRF/Automation</Chip>
            <Chip size="sm">Nextjs</Chip>
            <Chip size="sm">Hardhat</Chip>
            <span>...</span>
        </div>
      </CardBody>
    </Card>
    )
}