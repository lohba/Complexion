// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const artifacts = require("hardhat");
const ethers = require("hardhat");
const fs = require("fs");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.

  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  //We get the contract to deploy
  let contracts = [];

  // ethers is avaialble in the global scope
  const [deployer] = await hre.ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());


  // Red
  const RedContract = await hre.ethers.getContractFactory("Red");
  const redContract = await RedContract.deploy();
  await redContract.deployed();
  console.log("Red deployed to:", redContract.address);
  contracts.push({name: "Red", contract: redContract});

  // Blue
  const BlueContract = await hre.ethers.getContractFactory("Blue");
  const blueContract = await BlueContract.deploy();
  await blueContract.deployed();
  console.log("Blue deployed to:", blueContract.address);
  contracts.push({name: "Blue", contract: blueContract});

  // Yellow
  const YellowContract = await hre.ethers.getContractFactory("Yellow");
  const yellowContract = await YellowContract.deploy();
  await yellowContract.deployed();
  console.log("Yellow deployed to:", yellowContract.address);
  contracts.push({name: "Yellow", contract: yellowContract});

  // Green
  const GreenContract = await hre.ethers.getContractFactory("Green");
  const greenContract = await GreenContract.deploy();
  await greenContract.deployed();
  console.log("Green deployed to:", greenContract.address);
  contracts.push({name: "Green", contract: greenContract});

  // Game Logic
  const GameLogic = await hre.ethers.getContractFactory("GameLogic");
  const gameLogic = await GameLogic.deploy(
    redContract.address,
    blueContract.address,
    yellowContract.address,
    greenContract.address
  );
  contracts.push({name: "GameLogic", contract: gameLogic});


  redContract.transferOwnership(gameLogic.address);
  blueContract.transferOwnership(gameLogic.address);
  yellowContract.transferOwnership(gameLogic.address);
  greenContract.transferOwnership(gameLogic.address);

  await gameLogic.deployed();
  console.log("GameLogic deployed to:", gameLogic.address);


  saveFrontendFiles(contracts);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
function saveFrontendFiles(contracts) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  let jsonAddress = {};

  contracts.forEach(c => {

    // Build each fronend contract artifact
    const ContractArtifact = artifacts.readArtifactSync(c.name);
    fs.writeFileSync(
      contractsDir + "/" + c.name + ".json",
      JSON.stringify(ContractArtifact, null, 2)
    );

    // Create the jsonAdresses file of all contracts used
    Object.assign(jsonAddress, {[c.name]: c.contract.address})
  })

  fs.writeFileSync(
    contractsDir + "/contracts-address.json",
    JSON.stringify(jsonAddress, undefined, 2)
  );
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
