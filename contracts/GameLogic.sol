//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/PullPayment.sol";
import "hardhat/console.sol";

interface IRed {
    //function vote() external payable;
    //function getMintPrice(uint256 _supply) external view returns (uint256);
    // only mint function;
}

contract GameLogic is PullPayment{
    uint256 public roundNumber;  
    address public currentRoundPool;
    address public sidePotPool;
    uint256 public oldSupply; 
    string RedContract = "0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B";
        
    mapping(string => NFT) public colorToNFT;
    mapping(uint256 => bool) public winnerRound;
    mapping(address => NFT) public voted;


    event Voted(address voter, uint256 price, uint256 roundNumber, string color);

    constructor() {
        red.mintPrice = 0.1 ether;
        blue.mintPrice = 0.1 ether;
        yellow.mintPrice = 0.1 ether;
        green.mintPrice = 0.1 ether;
        red.oldSupply; // 0 supply first
        blue.oldSupply;
        green.oldSupply;
        yellow.oldSupply;
        colorToNFT["red"] = red;
        colorToNFT["blue"] = blue;
        colorToNFT["yellow"] = yellow;
        colorToNFT["green"] = green;
    }
        
    NFT public red; 
    NFT public blue;
    NFT public green;
    NFT public yellow;

    struct NFT {
        uint256 roundNumber; 
        uint256 oldSupply;
        uint256 mintPrice;
        address nftAddress;
        bool wonRound;
        bool voted;
    }


    function voteForColor(string memory _color) public payable {
        NFT storage currentNFT = colorToNFT[_color];
        require(voted[msg.sender].voted == false, "Already voted this round"); // check player hasn't voted this round);
        // update supply
        currentNFT.oldSupply+= 1;        
        // get price     
        uint256 price = (currentNFT.oldSupply <= 4) ? currentNFT.mintPrice
            : (currentNFT.oldSupply <= 7) ? currentNFT.mintPrice + 0.1 ether
            : (currentNFT.oldSupply  <= 9) ? currentNFT.mintPrice + 0.2 ether
            : currentNFT.mintPrice + 0.3 ether; 

        console.log(price);
        console.log(currentNFT.oldSupply);

        // Calcualte distribution and send ETH to currentPool and sidePoool using PullPayment
        _asyncTransfer(currentRoundPool, msg.value * 90 / 100); 
        _asyncTransfer(sidePotPool, msg.value * 9 / 100); 

        // update voted to true
        voted[msg.sender].voted = true;

        if(currentNFT.oldSupply == 10) {
            winnerRound[currentNFT.roundNumber] == true;
        }
        emit Voted(msg.sender, currentNFT.mintPrice, currentNFT.roundNumber, _color); 
    }

    // function mintWinner() public {
    //     require()
    // }
}



