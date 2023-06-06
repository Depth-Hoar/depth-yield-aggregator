// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import "@aave/core-v3/contracts/interfaces/IPool.sol";
import "hardhat/console.sol";
import "./IComet.sol";

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

    address public locationOfFunds; // Keep track of where your balance is
    uint256 public depositAmount;

    IERC20 immutable weth;
    IERC20 immutable aaveAweth;
    IComet immutable comet;
    IPool aavePool;

    event Deposit(address owner, uint256 amount, address depositTo);
    event Withdraw(address owner, uint256 amount, address withdrawFrom);
    event Rebalance(address owner, uint256 amount, address depositTo);

    constructor() Ownable() {
        weth = IERC20(WETH_Address);
        aaveAweth = IERC20(AaaveWETH_Address);
        comet = IComet(CompoundV3ProxyAddress);
    }

    function deposit(
        uint256 _amount,
        uint256 _compAPY,
        uint256 _aaveAPY
    ) external onlyOwner {
        require(_amount > 0);

        if (depositAmount > 0) {
            rebalance(_compAPY, _aaveAPY);
        }

        weth.transferFrom(msg.sender, address(this), _amount);
        depositAmount = depositAmount + _amount;

        if (_compAPY > _aaveAPY) {
            _depositToCompound(_amount);
        } else {
            _depositToAave(_amount);
        }

        emit Deposit(msg.sender, _amount, locationOfFunds);
    }

    function _getAavePool() private view returns (IPool) {
        address aaveV3PoolAddress = IPoolAddressesProvider(
            AaveV3PoolAddressProvider
        ).getPool();
        return IPool(aaveV3PoolAddress);
    }

    function _depositToAave(uint256 weth_amount) private {
        aavePool = _getAavePool();
        weth.approve(address(aavePool), weth_amount);
        aavePool.supply(address(weth), weth_amount, address(this), 0);
        locationOfFunds = address(aavePool);
    }

    function _depositToCompound(uint256 weth_amount) private {
        weth.approve(address(comet), weth_amount);
        comet.supply(address(weth), weth_amount);
        locationOfFunds = address(comet);
    }

    function withdraw() external onlyOwner returns (uint256) {
        require(depositAmount > 0);
        uint256 amount;

        if (locationOfFunds == address(comet)) {
            amount = _withdrawFromCompound();
            weth.transfer(msg.sender, amount);
            locationOfFunds = msg.sender;
        } else {
            amount = _withdrawFromAave();
            weth.transfer(msg.sender, amount);
            locationOfFunds = msg.sender;
            // console.log(amount, "amount");
        }

        emit Withdraw(msg.sender, depositAmount, locationOfFunds);
        depositAmount = 0;
        return amount;
    }

    function _withdrawFromCompound() private returns (uint256) {
        comet.withdraw(address(weth), comet.balanceOf(address(this)));
        return weth.balanceOf(address(this));
    }

    function _withdrawFromAave() private returns (uint256) {
        aavePool = _getAavePool();
        aaveAweth.approve(address(aavePool), type(uint).max);
        aavePool.withdraw(address(weth), type(uint).max, address(this));
        return weth.balanceOf(address(this));
    }

    function rebalance(uint256 _compAPY, uint256 _aaveAPY) public onlyOwner {
        require(depositAmount > 0);
        aavePool = _getAavePool();
        if ((_compAPY > _aaveAPY) && (locationOfFunds != address(comet))) {
            uint256 amount = _withdrawFromAave();
            _depositToCompound(amount);
            locationOfFunds = address(comet);
        } else if (
            (_aaveAPY > _compAPY) && (locationOfFunds != address(aavePool))
        ) {
            uint256 amount = _withdrawFromCompound();
            _depositToAave(amount);
            locationOfFunds = address(aavePool);
        }

        emit Rebalance(msg.sender, depositAmount, locationOfFunds);
    }

    // ===================== Getter Functions =====================

    function whereBalance() public view returns (address) {
        return locationOfFunds;
    }

    function depositBalance() public view returns (uint256) {
        return depositAmount;
    }
}
