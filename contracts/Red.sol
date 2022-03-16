//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/PullPayment.sol";
import "hardhat/console.sol";

contract Complexion is Ownable, ERC721Enumerable, PullPayment {
    
    string public _baseTokenURI;

    constructor() ERC721("Complexion", "COMPLEX") {

    }

    function mintWinner(string memory _tokenURI) external returns(uint256) {
        uint tokenId = totalSupply();
        _safeMint(msg.sender, tokenId);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }
}

