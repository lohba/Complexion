import { ethers } from "hardhat";
import chai from 'chai';
import { solidity } from "ethereum-waffle";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { BigNumber,Contract,ContractFactory } from "ethers";

describe("GameLogic", function () {
	// let deployer: SignerWithAddress;
	// let address1: SignerWithAddress;

	let Red : ContractFactory;
	let cRed: Contract;

	let Blue:ContractFactory;
	let cBlue: Contract;

	let Green: ContractFactory;
	let cGreen: Contract;

  let Yellow: ContractFactory;
	let cYellow: Contract;

	before(async function () {
		[deployer,address1] = await ethers.getSigners();
		Red = await ethers.getContractFactory("Red");
		Blue = await ethers.getContractFactory("Blue");
		Green = await ethers.getContractFactory("Green");
		Yellow = await ethers.getContractFactory("Yellow");
	});

  beforeEach(async function () {
		// Deploy Collection NFT
		cRed = await collectionNFT.deploy();
		await cRed.deployed();

		// Deploy Specto Follow NFT
		sfNFT = await spectoFollowNFT.deploy();
		await sfNFT.deployed();

		// Deploy spectoswap with above two addresses
		let args = [cNFT.address,sfNFT.address];
		ss = await spectoSwap.deploy(...args);
		await ss.deployed();

		tokenAmt = 1;
		// mint cNFT to deployer
		await cNFT.mint(tokenAmt);
		// Approve ss to spend cNFT
		cNFT.setApprovalForAll(ss.address,true);
		sfNFT.setApprovalForAll(ss.address,true);
		
		// mint sfNFT to address1
		await sfNFT.connect(address1).mint(tokenAmt);
		// Transfer NFTs to SpectoSwap Address
		for(let i=0;i<tokenAmt;i++){
			await sfNFT.connect(address1)['safeTransferFrom(address,address,uint256)'](address1.address,ss.address,i);
		}
	});

// describe("GameLogic", function () {
//   it("Should return the new greeting once it's changed", async function () {
//     const GameLogic = await ethers.getContractFactory("GameLogic");
//     const gameLogic = await GameLogic.deploy("Hello, world!");
//     await greeter.deployed();

//     expect(await greeter.greet()).to.equal("Hello, world!");

//     const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

//     // wait until the transaction is mined
//     await setGreetingTx.wait();

//     expect(await greeter.greet()).to.equal("Hola, mundo!");
//   });
// });
