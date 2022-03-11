//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/PullPayment.sol";


contract Complexion is Ownable, ERC721, PullPayment, ERC721Enumerable {

    string public baseURI;
    uint256 public roundNumber;
    uint256 public mintPrice = 0.1 ether;
    address public currentRoundPool;
    address public sidePotPool;
    uint256 public oldSupply;

    // stores a `Voter` struct for each possible address.
    mapping(address => Voter) public voters;
    mapping(uint256 => bool) public winnerRound;

    event Voted(address voter, uint256 price, uint256 roundNumber, string color);

    constructor(string memory _initialBaseURI) ERC721("Complexion", "COMPLEX") {
        baseURI = _initialBaseURI;
    }

    struct Voter {
        uint256 round; // round of vote
        bool voted;  // if true, that person already voted
    }

    function vote(uint256 _vote) public payable {
        Voter storage sender = voters[msg.sender];
        require(sender.voted != true, "Already voted this round"); // check player hasn't voted this round
        sender.voted = true;
        sender.round = roundNumber;

        uint256 printPrice = getPrintPrice(oldSupply + 1);
        require(msg.value == printPrice, "Insufficient funds");
        // update new supply
        oldSupply++;

        // Calcualte distribution and send ETH to currentPool and sidePoool using PullPayment
        _asyncTransfer(currentRoundPool, msg.value * 0.9); //fix
        _asyncTransfer(sidePotPool, msg.value * 0.09); //fix

        if(oldSupply == 10) {
            // won this round
            winnerRound[roundNumber] == true;
        }

        emit Voted(msg.sender, printPrice, roundNumber, "red"); // color

    }

    function getPrintPrice(uint256 _supply) public returns(uint256) {
        if(_supply < 4) {
            return mintPrice;
        } else if(_supply < 7) {
            return mintPrice + 0.1; //fix
        } 
        //....
    }

    function mintWinner() public {
        require(winnerRound[voters[msg.sender].round] == true); // check if round is a winner
        // Mint NFT
        uint tokenId = totalSupply();
        // check owner has not minted for this round 
        _safeMint(msg.sender, tokenId);
    }


    

}