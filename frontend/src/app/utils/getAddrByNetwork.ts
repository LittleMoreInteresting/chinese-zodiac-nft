import networkMapping from "@/constants/networkMapping.json";
interface NetworkMapping {
    [key: string]: { ChineseZodiac: any[]};
}
export const getNftAddrByNetworkId = (networkId: string): string => {
    const network = (networkMapping as NetworkMapping)[networkId];
    if (
        network &&
        network.ChineseZodiac &&
        network.ChineseZodiac.length > 0
    ) {
        return  network.ChineseZodiac[0];
    } else {
        return  "";
    }
}