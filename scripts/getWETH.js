const { ethers } = require("hardhat");
const { abi: IERC20_ABI } = require("@openzeppelin/contracts/build/contracts/IERC20.json");

const WETH_Address = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'


async function main() {
  let WETH;
  [owner, user] = await ethers.getSigners();
  WETH = new ethers.Contract(WETH_Address, IERC20_ABI, owner);
  const amount = ethers.utils.parseEther('100');
  await owner.sendTransaction({
    to: WETH.address,
    value: amount
  });
  const WETH_Balance = await WETH.balanceOf(owner.address)
  console.log('WETH:', WETH_Balance.toString())
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});