
const hre = require("hardhat");

async function main() {
  const[deployer] = await hre.ethers.getSigners();
  const Domain = await hre.ethers.getContractFactory("Domain");
  const domain = await Domain.deploy("wis");

  await domain.deployed();

  console.log("Domain deployed to:", domain.address);
  console.log("Domain deployed by:", deployer.address);
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
