const { ethers } = require("ethers");

const getCompoundAPY = async (cUSDC_Contract) => {
  const SECONDS_PER_YEAR = ethers.BigNumber.from("60").mul(60).mul(24).mul(365);
  const SCALE = ethers.BigNumber.from("10").pow(18);

  const utilization = await cUSDC_Contract.getUtilization();

  // // Get the supply rate
  const supplyRate = await cUSDC_Contract.getSupplyRate(utilization);

  // // Calculate the APY
  const apy = supplyRate / SCALE * SECONDS_PER_YEAR * 100;

  return apy;

}

const getAaveAPY = async (aaveLendingPool_contract) => {
    // const DAI = '0x6b175474e89094c44da98b954eedeac495271d0f';

    // const { currentLiquidityRate } = await aaveLendingPool_contract.getReserveData(DAI);
    // const aaveAPY = currentLiquidityRate.div(1e7);

    // return aaveAPY;
}

module.exports = {
  getCompoundAPY,
  getAaveAPY
}