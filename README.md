# ERC-20 Token Faucet DApp

## Overview
This is a full-stack decentralized application that allows users to claim ERC-20 tokens from a faucet with:
- 24-hour cooldown per address  
- Lifetime claim limit per address  
- MetaMask wallet integration  
- Real-time token balance updates  

The app is containerized with Docker and deployed on the **Sepolia testnet**.

## Project Structure
```
submission/
├── contracts/
│   ├── Token.sol
│   ├── TokenFaucet.sol
│   └── test/TokenFaucet.test.js
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── utils/contracts.js
│   │   └── utils/eval.js
│   ├── Dockerfile
│   └── package.json
├── scripts/deploy.js
├── docker-compose.yml
├── .env.example
└── README.md
```

## Deployed Contracts
- Token: `0xf4d4fE1207f95e698Eadd1bBB3690fbeECfd9a60`  
- Faucet: `0xCaa82f1915D0E34f903E1bfc15822EDBad86a6b6`  

## Quick Start
1. Copy `.env.example` to `.env` and fill in your values:
```
VITE_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/GwxW0CjLc-9BFYKWTiJcm
VITE_TOKEN_ADDRESS=0xf4d4fE1207f95e698Eadd1bBB3690fbeECfd9a60
VITE_FAUCET_ADDRESS=0xCaa82f1915D0E34f903E1bfc15822EDBad86a6b6
```
2. Run the application:
```bash
docker compose up
```
3. Open [http://localhost:5173/](http://localhost:5173/)

## Smart Contracts
- **Token.sol**: ERC-20 compliant, fixed max supply, only faucet can mint  
- **TokenFaucet.sol**: Distributes tokens, tracks last claim and total claimed per address, admin can pause/unpause  

**Public Functions**
- `requestTokens()` – claim tokens  
- `canClaim(address)` – check eligibility  
- `remainingAllowance(address)` – check remaining claimable tokens  
- `isPaused()` – check faucet pause state  

**Events**
- `TokensClaimed(address, amount, timestamp)`  
- `FaucetPaused(bool paused)`

## Frontend
- Connect/disconnect MetaMask  
- Show token balance, claim eligibility, cooldown, and remaining allowance  
- Request tokens with loading states and error messages  

**Evaluation Interface**
```javascript
window.__EVAL__ = {
  connectWallet: async () => { ... },
  requestTokens: async () => { ... },
  getBalance: async (address) => { ... },
  canClaim: async (address) => { ... },
  getRemainingAllowance: async (address) => { ... },
  getContractAddresses: async () => {
    return { token: "0xYourTokenAddress", faucet: "0xYourFaucetAddress" }
  }
};
```

## Docker
- Frontend runs on **port 5173**  
- Health check endpoint: `/health`  

## Testing
- Unit tests for token and faucet functionality in `TokenFaucet.test.js`  
- Includes cooldown, lifetime limits, pause, events, and edge cases  

## Notes
- Only edit contract addresses and RPC key  
- Faucet enforces cooldown and lifetime limits  
- Admin-only pause works  
- Docker container runs the frontend immediately
