// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    address public faucet;

    constructor(address faucetAddress) ERC20("MyToken", "MTK") {
        faucet = faucetAddress;
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }
}
