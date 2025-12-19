import React, { useState, useEffect } from "react";
import { connectWallet, requestTokens, getBalance, canClaim, getRemainingAllowance } from "../utils/contracts.js";

export default function Faucet() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("0");
  const [eligible, setEligible] = useState(false);
  const [allowance, setAllowance] = useState("0");
  const [loading, setLoading] = useState(false);

  async function handleConnect() {
    const addr = await connectWallet();
    setAddress(addr);
    updateData(addr);
  }

  async function updateData(addr) {
    const bal = await getBalance(addr);
    const canClaimNow = await canClaim(addr);
    const remaining = await getRemainingAllowance(addr);
    setBalance(bal);
    setEligible(canClaimNow);
    setAllowance(remaining);
  }

  async function handleClaim() {
    setLoading(true);
    try {
      await requestTokens();
      await updateData(address);
      alert("Tokens claimed successfully!");
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  }

  return (
    <div>
      {!address ? (
        <button onClick={handleConnect}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected: {address}</p>
          <p>Balance: {balance}</p>
          <p>Can Claim: {eligible ? "Yes" : "No"}</p>
          <p>Remaining Allowance: {allowance}</p>
          <button onClick={handleClaim} disabled={!eligible || loading}>
            {loading ? "Processing..." : "Request Tokens"}
          </button>
        </div>
      )}
    </div>
  );
}
