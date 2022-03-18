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

  // Game Logic
  const GameLogic = await hre.ethers.getContractFactory("GameLogic");
  const gameLogic = await GameLogic.deploy(
    redContract.address,
    blueContract.address,
    yellowContract.address,
    greenContract.address
  );
  
  await gameLogic.deployed();
  console.log("GameLogic deployed to:", gameLogic.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
