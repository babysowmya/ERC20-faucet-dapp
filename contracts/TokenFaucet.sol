// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenFaucet {
    ERC20 public token;
    address public admin;
    bool public paused;

    uint256 public constant FAUCET_AMOUNT = 100 * 10**18; // Amount per claim
    uint256 public constant COOLDOWN_TIME = 24 hours;     // 24-hour cooldown
    uint256 public constant MAX_CLAIM_AMOUNT = 1000 * 10**18; // Lifetime limit

    mapping(address => uint256) public lastClaimAt;
    mapping(address => uint256) public totalClaimed;

    // Events
    event TokensClaimed(address indexed user, uint256 amount, uint256 timestamp);
    event FaucetPaused(bool paused);

    constructor(address tokenAddress) {
        token = ERC20(tokenAddress);
        admin = msg.sender;
        paused = false;
    }

    function requestTokens() external {
        require(!paused, "Faucet is paused");
        require(canClaim(msg.sender), "Cooldown period not elapsed or lifetime limit reached");
        require(totalClaimed[msg.sender] + FAUCET_AMOUNT <= MAX_CLAIM_AMOUNT, "Lifetime limit reached");
        require(token.balanceOf(address(this)) >= FAUCET_AMOUNT, "Not enough tokens in faucet");

        // Update state
        lastClaimAt[msg.sender] = block.timestamp;
        totalClaimed[msg.sender] += FAUCET_AMOUNT;

        // Transfer tokens
        token.transfer(msg.sender, FAUCET_AMOUNT);

        emit TokensClaimed(msg.sender, FAUCET_AMOUNT, block.timestamp);
    }

    function canClaim(address user) public view returns (bool) {
        if (paused) return false;
        if (block.timestamp < lastClaimAt[user] + COOLDOWN_TIME) return false;
        if (totalClaimed[user] >= MAX_CLAIM_AMOUNT) return false;
        return true;
    }

    function remainingAllowance(address user) external view returns (uint256) {
        if (totalClaimed[user] >= MAX_CLAIM_AMOUNT) return 0;
        return MAX_CLAIM_AMOUNT - totalClaimed[user];
    }

    function setPaused(bool _paused) external {
        require(msg.sender == admin, "Only admin can pause");
        paused = _paused;
        emit FaucetPaused(paused);
    }
}
