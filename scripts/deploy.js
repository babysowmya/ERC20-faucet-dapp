const hre = require("hardhat");

async function main() {

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  // Deploy Faucet
  const Faucet = await hre.ethers.getContractFactory("TokenFaucet");

  const faucet = await Faucet.deploy(
    hre.ethers.ZeroAddress,
    { gasLimit: 8000000 }
  );

  await faucet.waitForDeployment();

  // Deploy Token
  const Token = await hre.ethers.getContractFactory("MyToken");

  const token = await Token.deploy(
    await faucet.getAddress(),
    { gasLimit: 8000000 }
  );

  await token.waitForDeployment();

  console.log("Token deployed to:", await token.getAddress());
  console.log("Faucet deployed to:", await faucet.getAddress());

  // ⭐ FIX 1: limit gas
  await faucet.setToken(await token.getAddress(), {
    gasLimit: 200000
  });

  // ⭐ FIX 2: limit gas
  const amount = hre.ethers.parseUnits("100000", 18);

  await token.transfer(await faucet.getAddress(), amount, {
    gasLimit: 200000
  });

  console.log("Tokens transferred to faucet");

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});