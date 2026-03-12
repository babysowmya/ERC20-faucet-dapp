const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token Faucet", function () {
  let token, faucet, owner, user;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("FaucetToken");
    token = await Token.deploy();

    const Faucet = await ethers.getContractFactory("TokenFaucet");
    faucet = await Faucet.deploy(token.address);

    await token.setFaucet(faucet.address);
  });

  it("User can claim tokens", async function () {
    await faucet.connect(user).requestTokens();
    const balance = await token.balanceOf(user.address);
    expect(balance).to.be.gt(0);
  });

  it("Cooldown prevents immediate re-claim", async function () {
    await faucet.connect(user).requestTokens();
    await expect(
      faucet.connect(user).requestTokens()
    ).to.be.reverted;
  });
});
