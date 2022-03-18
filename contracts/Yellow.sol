//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";

contract Yellow is Ownable, ERC721Enumerable {

    string public _baseTokenURI;
    string yellowTokenURI = "https://gateway.pinata.cloud/ipfs/QmNeiZxZTZHkUuAH1EUZtgDXZcfXr9PoNk1WFYXdmCNYrx/Yellow.json";

    constructor() ERC721("Complexion", "COMPLEX") {
    }

    using Strings for uint256;
    // Optional mapping for token URIs
    mapping(uint256 => string) private _tokenURIs;

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721URIStorage: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }
    
    function tokenURI(uint256 tokenId) override public view returns (string memory) {
        return yellowTokenURI;
    }
    
    function mintWinner(address _minter) external onlyOwner{
        uint tokenId = totalSupply();
        _safeMint(_minter, tokenId);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }
}