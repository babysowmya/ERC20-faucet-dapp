import { ethers } from "ethers";
import TokenJson from "../../artifacts/contracts/Token.sol/MyToken.json";
import FaucetJson from "../../artifacts/contracts/TokenFaucet.sol/TokenFaucet.json";

const provider = new ethers.BrowserProvider(window.ethereum);
let signer;

const TOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const FAUCET_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const tokenContract = new ethers.Contract(TOKEN_ADDRESS, TokenJson.abi, provider);
const faucetContract = new ethers.Contract(FAUCET_ADDRESS, FaucetJson.abi, provider);

export async function connectWallet() {
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();
  return signer.getAddress();
}

export async function getBalance(addr) {
  const bal = await tokenContract.balanceOf(addr);
  return bal.toString();
}

export async function canClaim(addr) {
  return faucetContract.canClaim(addr);
}

export async function getRemainingAllowance(addr) {
  return faucetContract.remainingAllowance(addr);
}

export async function requestTokens() {
  const tx = await faucetContract.connect(signer).requestTokens();
  await tx.wait();
  return tx.hash;
}
