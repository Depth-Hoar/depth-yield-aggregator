// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import "@aave/core-v3/contracts/interfaces/IPool.sol";
import "hardhat/console.sol";

contract Aggregator is Ownable {
    // might have to use constant
    address public immutable AaveV3PoolAddressProvider =
        0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e;
    address public immutable WETH_Address =
        0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address public immutable CompoundV3ProxyAddress =
        0xA17581A9E3356d9A858b789D68B4d866e593aE94;
    address public immutable AaaveWETH_Address =
        0x4d5F47FA6A74757f35C14fD3a6Ef8E3C9BC514E8;

    IERC20 immutable weth;
    IERC20 immutable aaveAweth;

    constructor() Ownable() {
        weth = IERC20(WETH_Address);
        aaveAweth = IERC20(AAVE_A_WETH_MAINNET_ADDRESS);
        // comet = IComet(COMPOUND_V3_PROXY_MAINNET_ADDRESS);
    }

    function deposit(
        uint256 _amount,
        uint256 _compAPY,
        uint256 _aaveAPY
    ) external onlyOwner {
        require(_amount > 0);

        if (_compAPY > _aaveAPY) {
            // Deposit into Compound
            // require(_depositToCompound(_amount) == 0);
            // Update location
        } else {
            // Deposit into Aave
            _deposit_to_aave(_amount);
        }
    }

    function _getAavePool() private view returns (IPool) {
        address aaveV3PoolAddress = IPoolAddressesProvider(
            AaveV3PoolAddressProvider
        ).getPool();
        return IPool(aaveV3PoolAddress);
    }

    function _deposit_to_aave(uint256 weth_amount) private {
        IPool aavePool = _getAavePool();
        weth.approve(address(aavePool), weth_amount);
        console.log(address(aavePool));
        aavePool.supply(address(weth), weth_amount, address(this), 0);
    }
}
