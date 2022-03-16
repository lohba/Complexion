//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/PullPayment.sol";
import "hardhat/console.sol";

interface INFT {
    function mintWinner() external;
}

contract GameLogic is PullPayment{
    uint256 public roundNumber = 1;  
    string public winningColor;
    uint256 public winningRound;
    address public currentRoundPool;
    address public sidePotPool;

    address RedContract = 0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B;
        
    mapping(string => NFT) public colorToNFT;
    mapping(uint256 => bool) public winnerRound;
    //mapping(string => bool) public winnerColor;

    mapping(address => mapping(uint => Voter)) public roundToVoter; // address => round => Voter struct

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
        uint256 oldSupply;
        string color;
        uint256 mintPrice;
        address nftAddress;
    }

    struct Voter {
        bool voted;
        string color;
        uint256 mintPrice;
        bool minted;
    }
       
    function voteForColor(string memory _color) public payable {
        NFT storage currentNFT = colorToNFT[_color];
        require(roundToVoter[msg.sender][roundNumber].voted == false, "Already voted this round"); // check player hasn't voted this round);
        // update NFT supply
        currentNFT.oldSupply += 1;
        // assign color 
        currentNFT.color = _color;
        // asign color to voter
        roundToVoter[msg.sender][roundNumber].color = _color;
        
        // get price     
        uint256 price = (currentNFT.oldSupply <= 4) ? currentNFT.mintPrice
            : (currentNFT.oldSupply <= 7) ? currentNFT.mintPrice + 0.1 ether
            : (currentNFT.oldSupply  <= 9) ? currentNFT.mintPrice + 0.2 ether
            : currentNFT.mintPrice + 0.3 ether;

        // check value being sent for vote
        require(msg.value == price, "Insufficient amount");
        // assign price to mintPrice in struct
        currentNFT.mintPrice == price;
        roundToVoter[msg.sender][roundNumber].mintPrice = price;

        console.log("Price is ", price);
        console.log("Supply is ", currentNFT.oldSupply);
        console.log("Supply round number is ", roundNumber);

        // Calcualte distribution and send ETH to currentPool and sidePoool using PullPayment
        _asyncTransfer(currentRoundPool, msg.value * 90 / 100); 
        _asyncTransfer(sidePotPool, msg.value * 9 / 100); 

        // if the 10th NFT is minted there is a winning color 
        if(currentNFT.oldSupply == 10) {
            winningRound = roundNumber;
            winningColor = currentNFT.color;
        }

        // update voted to true
        roundToVoter[msg.sender][roundNumber].voted = true;
        
        emit Voted(msg.sender, currentNFT.mintPrice, roundNumber, _color); 
    }

    function mintWinner() public view {
        require(keccak256(abi.encodePacked(roundToVoter[msg.sender][winningRound].color)) == keccak256(abi.encodePacked(winningColor)), "Not the winning color");
        require(roundToVoter[msg.sender][winningRound].minted == false, "Already minted this round");
        console.log("minted!");
        // run reset function 1 hour after mintwinner() is called
        
        // have to know the amount sent 
        // have to calculate the pool prize
    
        //INFT(0x7EF2e0048f5bAeDe046f6BF797943daF4ED8CB47).mintWinner();
    }   

    function reset() private {
        roundNumber += 1;
        // reset structs for all colors
        red.oldSupply = 0;
        red.mintPrice = 0.1 ether;
        blue.oldSupply = 0;
        blue.mintPrice = 0.1 ether;
        yellow.oldSupply = 0;
        yellow.mintPrice = 0.1 ether;
        green.oldSupply = 0;
        green.mintPrice = 0.1 ether;

    }
}




