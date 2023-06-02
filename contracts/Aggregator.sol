// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Aggregator {
    function getCurrentBlock() public view returns (uint256) {
        return block.number;
    }
}
