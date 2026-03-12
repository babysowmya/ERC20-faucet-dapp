// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenFaucet {

    ERC20 public token;
    address public admin;
    bool public paused;

    uint256 public constant FAUCET_AMOUNT = 100 * 10**18;
    uint256 public constant COOLDOWN_TIME = 24 hours;
    uint256 public constant MAX_CLAIM_AMOUNT = 1000 * 10**18;

    mapping(address => uint256) public lastClaimAt;
    mapping(address => uint256) public totalClaimed;

    event TokensClaimed(address indexed user, uint256 amount);
    event FaucetPaused(bool paused);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    constructor(address tokenAddress) {
        token = ERC20(tokenAddress);
        admin = msg.sender;
        paused = false;
    }

    // ⭐ FIX 1: set token after deployment
    function setToken(address tokenAddress) external onlyAdmin {
        token = ERC20(tokenAddress);
    }

    function requestTokens() external {

        require(!paused, "Faucet paused");

        require(
            token.balanceOf(address(this)) >= FAUCET_AMOUNT,
            "Not enough tokens in faucet"
        );

        require(
            block.timestamp >= lastClaimAt[msg.sender] + COOLDOWN_TIME,
            "Cooldown period active"
        );

        require(
            totalClaimed[msg.sender] + FAUCET_AMOUNT <= MAX_CLAIM_AMOUNT,
            "Lifetime limit reached"
        );

        lastClaimAt[msg.sender] = block.timestamp;

        totalClaimed[msg.sender] += FAUCET_AMOUNT;

        token.transfer(msg.sender, FAUCET_AMOUNT);

        emit TokensClaimed(msg.sender, FAUCET_AMOUNT);
    }

    function canClaim(address user) public view returns (bool) {

        if (paused) return false;

        if (block.timestamp < lastClaimAt[user] + COOLDOWN_TIME)
            return false;

        if (totalClaimed[user] + FAUCET_AMOUNT > MAX_CLAIM_AMOUNT)
            return false;

        return true;
    }

    // ⭐ FIX 2: correct remaining allowance
    function remainingAllowance(address user)
        external
        view
        returns (uint256)
    {
        if (totalClaimed[user] >= MAX_CLAIM_AMOUNT) {
            return 0;
        }

        return MAX_CLAIM_AMOUNT - totalClaimed[user];
    }

    // ⭐ FIX 3: pause function
    function setPaused(bool _paused) external onlyAdmin {
        paused = _paused;
        emit FaucetPaused(paused);
    }

    // ⭐ FIX 4: required by tests
    function isPaused() external view returns (bool) {
        return paused;
    }
}