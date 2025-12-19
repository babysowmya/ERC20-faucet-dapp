import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { FAUCET_ADDRESS, FAUCET_ABI } from "./config";

function App() {
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("");

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask not installed");
      return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setAddress(accounts[0]);
  };

  const claimTokens = async () => {
  try {
    if (!window.ethereum) {
      alert("MetaMask not found");
      return;
    }

    // 🔒 Force Sepolia
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xaa36a7" }], // Sepolia
    });

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const faucet = new ethers.Contract(
      FAUCET_ADDRESS,
      FAUCET_ABI,
      signer
    );

    const tx = await faucet.requestTokens();
    await tx.wait();

    alert("✅ Tokens claimed!");
  } catch (err) {
    console.error(err);
    alert("❌ Cannot claim tokens yet");
  }
};


  useEffect(() => {
    const autoConnect = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) setAddress(accounts[0]);
      }
    };
    autoConnect();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>ERC-20 Faucet DApp</h1>

      {!address ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          <p>Connected: {address}</p>
          <button onClick={claimTokens}>Claim Tokens</button>
          <p>{status}</p>
        </>
      )}
    </div>
  );
}

export default App;
