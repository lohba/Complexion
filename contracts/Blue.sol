//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "hardhat/console.sol";

contract Blue is Ownable, ERC721Enumerable {

    string public _baseTokenURI;
    string blueTokenURI = "https://gateway.pinata.cloud/ipfs/QmNeiZxZTZHkUuAH1EUZtgDXZcfXr9PoNk1WFYXdmCNYrx/Blue.json";

    constructor() ERC721("Complexion", "COMPLEX") {
    }

    using Strings for uint256;
    // Optional mapping for token URIs
    mapping(uint256 => string) private _tokenURIs;

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721URIStorage: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }
    
    function mintWinner(address _minter) external returns(uint256) {
        uint tokenId = totalSupply();
        _safeMint(_minter, tokenId);
        _setTokenURI(tokenId, blueTokenURI);
        return tokenId;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }
}

