const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  // 1️⃣ Deploy Faucet with temporary token address
  const Faucet = await hre.ethers.getContractFactory("TokenFaucet");
  const faucet = await Faucet.deploy(hre.ethers.ZeroAddress);
  await faucet.waitForDeployment();

  // 2️⃣ Deploy Token with faucet address
  const Token = await hre.ethers.getContractFactory("MyToken");
  const token = await Token.deploy(await faucet.getAddress());
  await token.waitForDeployment();

  console.log("Token deployed to:", await token.getAddress());
  console.log("Faucet deployed to:", await faucet.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
