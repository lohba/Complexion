// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
  
  //We get the contract to deploy

  // Red
  const RedContract = await hre.ethers.getContractFactory("Red");
  const redContract = await RedContract.deploy();
  await redContract.deployed();
  console.log("Red deployed to:", redContract.address);

  // Blue
  const BlueContract = await hre.ethers.getContractFactory("Blue");
  const blueContract = await BlueContract.deploy();
  await blueContract.deployed();
  console.log("Blue deployed to:", blueContract.address);

  // Yellow
  const YellowContract = await hre.ethers.getContractFactory("Yellow");
  const yellowContract = await YellowContract.deploy();
  await yellowContract.deployed();
  console.log("Yellow deployed to:", yellowContract.address);

  // Green
  const GreenContract = await hre.ethers.getContractFactory("Green");
  const greenContract = await GreenContract.deploy();
  await greenContract.deployed();
  console.log("Green deployed to:", greenContract.address);

  // Game Logic
  const GameLogic = await hre.ethers.getContractFactory("GameLogic");
  const gameLogic = await GameLogic.deploy(
    redContract.address,
    blueContract.address,
    yellowContract.address,
    greenContract.address
  );

  redContract.transferOwnership(gameLogic.address);
  blueContract.transferOwnership(gameLogic.address);
  yellowContract.transferOwnership(gameLogic.address);
  greenContract.transferOwnership(gameLogic.address);

  await gameLogic.deployed();
  console.log("GameLogic deployed to:", gameLogic.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
