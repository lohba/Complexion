//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";

contract GreenComplexion is Ownable, ERC721Enumerable {

    string public _baseTokenURI;
    string tokenURI = "https://gateway.pinata.cloud/ipfs/QmNeiZxZTZHkUuAH1EUZtgDXZcfXr9PoNk1WFYXdmCNYrx/Green.json";

    constructor() ERC721("Complexion", "COMPLEX") {
    }

    function mintWinner(address _minter, string memory _tokenURI) external returns(uint256) {
        uint tokenId = totalSupply();
        _safeMint(_minter, tokenId);
        //_setTokenURI(tokenId, tokenURI);
        return tokenId;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }
}