//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/finance/PaymentSplitter.sol";

contract Payment is PaymentSplitter {
    
    constructor (address[] memory _payees, uint256[] memory _shares) PaymentSplitter(_payees, _shares) payable {}
    
}


// Predeploy NFT Contract separately (Red,Blue,Green,Yellow) => only difference is the URI
// Make calls from deployed contract 

// sidePool => claim() 