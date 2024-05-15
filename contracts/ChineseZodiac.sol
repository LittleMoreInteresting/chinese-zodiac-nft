// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
error NOT__IN__WHITE__LIST();
error NO__ENOUGH__ETH();
error NO__ENOUGH__NFT();
error MAX__NUMBER__OF__NFT__OVER__1();
error OVER__MAX__NUM__OF__BES();
error IpfsNFT__TransferFailed();
error ONCE_ERROR_DAY();
contract ChineseZodiac is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    Ownable,
    VRFConsumerBaseV2
{
   uint256 _tokenIdCounter = 1;

    mapping(uint => string[]) private allMetaData;
    uint private lengthOfMetaData;

    uint private immutable maxNumberOftoken;

    //All variables blow are belong to VRF
    VRFCoordinatorV2Interface COORDINATOR;

    // Your subscription ID.
    uint64 immutable s_subscriptionId;

    bytes32 immutable keyHash; // subscription
    uint32 public immutable callbackGasLimit; 

    // The default is 3, but you can set this higher. 
    uint16 constant requestConfirmations = 3;

    // For this example, retrieve 2 random values in one request.
    // Cannot exceed VRFCoordinatorV2.MAX_NUM_WORDS.
    uint32 constant numWords = 1;

    /* requestId --> NFT TOKEN */
    mapping(uint256 => uint) public resToToken;

    // configure a default value for 10
    uint8 public currentHour = 8;

    // configure a default value for Warm
    DayState public currentDayState = DayState.AM;

    mapping(uint => uint) tokenIdtoModeValue;

    enum DayState {
        AM,
        PM
    }
    uint constant internal SECONDS_PER_HOUR = 60 * 60;
    mapping(address => uint256) latestMintTime ;

    event MintRequest(uint256 indexed requestId);
    event MintSuccess(uint256 indexed requestId);
    
    constructor(
        uint _maxNumberOftoken,
        uint64 _subscriptionId,
        address _VRFADDRESS,
        bytes32 _keyHash
    )
        ERC721("Zodiac", "ZOD")
        Ownable(_msgSender())
        VRFConsumerBaseV2(_VRFADDRESS)
    {
        COORDINATOR = VRFCoordinatorV2Interface(_VRFADDRESS);
        keyHash = _keyHash;
        s_subscriptionId = _subscriptionId;
        callbackGasLimit = 250000;
        maxNumberOftoken = _maxNumberOftoken;
        string[] storage Rat = allMetaData[0];
        Rat.push("https://ipfs.filebase.io/ipfs/QmaTJmndep1HPNCXZoihLsdkGLFNLJ25Hg3RPt26Cn8yaQ");
        Rat.push("https://ipfs.filebase.io/ipfs/QmY7yxyUEPTT6E2S6MvrpfgXECtGv57onnn2HKAVpoFmJo");

        string[] storage Ox = allMetaData[1];
        Ox.push("https://ipfs.filebase.io/ipfs/Qmdsn3ggUvx7L4HuKVqLZazVCgS6QGA6bwUboo86PYaCjQ");
        Ox.push("https://ipfs.filebase.io/ipfs/QmPwTR9dNnsZDysRHYx4w9Re4k88eHAASEZCghMS6rknHV");

        string[] storage Tiger = allMetaData[2];
        Tiger.push("https://ipfs.filebase.io/ipfs/QmUXSDn8QV8oHCZKPTuKdrZNJnGyUeU4wRFY59PjAdkcPo");
        Tiger.push("https://ipfs.filebase.io/ipfs/QmTd5UsUZEBu9VoZuHj4ZBz1dtbEQm6uDSSn25FgyN1pAB");

        string[] storage Rabbit = allMetaData[3];
        Rabbit.push("https://ipfs.filebase.io/ipfs/QmbdJUjpEtYLoDRCYsQQHjnvTMD4KKhkx9ivQafRX8a2uA");
        Rabbit.push("https://ipfs.filebase.io/ipfs/QmQPLQ45zZAndYJ3t8MvgPXUAMbFtzD1DynzSoth3J7Sw2");

        string[] storage Dragon = allMetaData[4];
        Dragon.push("https://ipfs.filebase.io/ipfs/QmUshMSEujeTVTffUg37AZmNSmTf4Zt4VwAherBLU68KiH");
        Dragon.push("https://ipfs.filebase.io/ipfs/QmfXUkXamf3Gy2h9wW8okBk6P3phPK23Mh7XGarTQMaiqM");

        string[] storage Snake = allMetaData[5];
        Snake.push("https://ipfs.filebase.io/ipfs/QmSdUdnNo9ozq9PXzEst4t4RoTWCYYtwaQir26aUXgK4sX");
        Snake.push("https://ipfs.filebase.io/ipfs/QmTpcqwyXkRxdaNNnchAGfaqUi7SmJ9huBVaNpR7hxFEdf");

        string[] storage Horse = allMetaData[6];
        Horse.push("https://ipfs.filebase.io/ipfs/QmQxKLm2wHZk6VxXJ8foVNALxST34vkhZ3b3pJAGNm8Ltz");
        Horse.push("https://ipfs.filebase.io/ipfs/QmPr8ZBkJMD6CCsQVD2YCoByQYH8aPUBPYyRR1J3dzrL2r");

        string[] storage Goat = allMetaData[7];
        Goat.push("https://ipfs.filebase.io/ipfs/QmWrWSgZybQwma9dCFJyEuTGGPXn51nD2YnLGk5AvrQSU3");
        Goat.push("https://ipfs.filebase.io/ipfs/QmPdg5ooFfo6UhD36L6ccMdwJe53fg1cvZtLYdkxUpmuLQ");

        string[] storage Monkey = allMetaData[8];
        Monkey.push("https://ipfs.filebase.io/ipfs/QmdxqGgyz6LkketVxxQcqpmTvFkCDEc6J31fB2NhVJqFSm");
        Monkey.push("https://ipfs.filebase.io/ipfs/QmcQCTgtsFZnz98SPrRJfjkCTyVM4LD4xWcZtWZCVYWYdA");

        string[] storage Rooster = allMetaData[9];
        Rooster.push("https://ipfs.filebase.io/ipfs/QmaaRNWbKkZ3RsW63aFtvtZPeNewFVNdxZPDmTEHYMFCK5");
        Rooster.push("https://ipfs.filebase.io/ipfs/QmNyZJoWDZZeRmBjxA4ZReaCGrRsCxW1ZdqLbsoEBFhCfR");

        string[] storage Dog = allMetaData[10];
        Dog.push("https://ipfs.filebase.io/ipfs/QmY1NLBvZzutzVucmZu6tUcktMbPhzkqVp9YqxTadJrk3w");
        Dog.push("https://ipfs.filebase.io/ipfs/QmaCGjL6vSBR7FuEbxgpFaUkoNH1w71U7L4AtAtxJUgEM3");

        string[] storage Pig = allMetaData[11];
        Pig.push("https://ipfs.filebase.io/ipfs/QmYnLpxuhTKtW3YgqiJi9eGynQaFeJ6PApwtSHaUG4FMVo");
        Pig.push("https://ipfs.filebase.io/ipfs/QmTZ2Edqa4PniZxLyMmArg5jdj5BWhacabmZPjKGsbN3Ma");

        lengthOfMetaData = 12;
    }

    function mint() public payable {
        require(
            msg.value == 0.0005 ether,
            " The price of each MDS is 0.0005 ether."
        );
        if (balanceOf(msg.sender) >= 1) revert MAX__NUMBER__OF__NFT__OVER__1();
        if (totalSupply() >= maxNumberOftoken) revert OVER__MAX__NUM__OF__BES();
        request(_tokenIdCounter,false);
        _tokenIdCounter++;
        latestMintTime[msg.sender] = block.timestamp;
    }

    function replaceMint() public payable {
        require(
            msg.value == 0.0001 ether,
            " The price of each replace is 0.0001 ether."
        );
        if (balanceOf(msg.sender) < 1) revert NO__ENOUGH__NFT();
        if((block.timestamp - latestMintTime[msg.sender]) <  1 days ){
            revert ONCE_ERROR_DAY();
        }
        uint256 tokenId = tokenOfOwnerByIndex(msg.sender,0);
        request(tokenId,true);
        latestMintTime[msg.sender] = block.timestamp;
    }

    // Assumes the subscription is funded sufficiently.
    function request(uint256 tokenId,bool isReplace) internal returns (uint256 requestId) {
        // Will revert if subscription is not set and funded.
        requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        if (!isReplace){
            _safeMint(msg.sender, tokenId);
        }       
        resToToken[requestId] = tokenId;
        emit MintRequest(requestId);
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        // obtain a mode value
        uint256 modeValue = (_randomWords[0] % lengthOfMetaData);
        uint tokenId = resToToken[_requestId];
        tokenIdtoModeValue[tokenId] = modeValue;
        // According to the metadata configured above,use the index 0 of the pic array as default pic
        _setTokenURI(tokenId, allMetaData[modeValue][uint8(DayState.AM)]);
        emit MintSuccess(_requestId);
    }

    function getTokenId() public view returns(uint256 tokenId) {
        if (balanceOf(msg.sender) < 1) revert NO__ENOUGH__NFT();
        tokenId = tokenOfOwnerByIndex(msg.sender, 0);
    }

    function changeNFTStatus() public {
       uint8 _hour = getCurrentHour(8);
        if (_hour != currentHour) {
            currentHour = _hour;
            DayState newDayState = checkDayState(_hour);
            if (newDayState != currentDayState) {
                currentDayState = newDayState;
                uint totalSupply = totalSupply();
                for (uint i = 1; i <= totalSupply; i++) {
                    uint modeValue = tokenIdtoModeValue[i];
                    _setTokenURI(
                        i,
                        allMetaData[modeValue][uint8(currentDayState)]
                    );
                }
            }
        }
    }

    function getCurrentHour(int8 timezone) private view returns (uint8) {
        int256 zonetime = int256(block.timestamp) + timezone * int(SECONDS_PER_HOUR);
        return uint8((uint256(zonetime) / 60 / 60) % 24);
    }

    function checkDayState(uint8 _hour) private pure returns (DayState) {
        if (_hour >= 6 && _hour <18) {
            return DayState.AM;
        }
        return DayState.PM;
    }

    function withdraw() public payable onlyOwner {
        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        if (!success) {
            revert IpfsNFT__TransferFailed();
        }
    }

    function getMaxNumberOftoken() public view returns (uint) {
        return maxNumberOftoken;
    }

    function getCurrentHour() public view returns (uint8) {
        return currentHour;
    }

    // The following functions are overrides required by Solidity.

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

}