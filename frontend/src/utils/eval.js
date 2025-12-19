import { getTokenContract, getFaucetContract, getProvider, getSigner } from "./contracts";

window.__EVAL__ = {
  connectWallet: async () => {
    if (!window.ethereum) throw new Error("MetaMask not installed");
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    return accounts[0];
  },

  requestTokens: async () => {
    const faucet = getFaucetContract();
    const tx = await faucet.requestTokens();
    await tx.wait();
    return tx.hash;
  },

  getBalance: async (address) => {
    const token = getTokenContract();
    const balance = await token.balanceOf(address);
    return balance.toString(); // Always return string
  },

  canClaim: async (address) => {
    const faucet = getFaucetContract();
    return await faucet.canClaim(address);
  },

  getRemainingAllowance: async (address) => {
    const faucet = getFaucetContract();
    const allowance = await faucet.remainingAllowance(address);
    return allowance.toString();
  },

  getContractAddresses: async () => {
    return {
      token: process.env.VITE_TOKEN_ADDRESS,
      faucet: process.env.VITE_FAUCET_ADDRESS
    };
  }
};
