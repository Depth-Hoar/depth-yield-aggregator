const { expect } = require("chai");
const { ethers } = require("hardhat");
const { abi: IERC20_ABI } = require("@openzeppelin/contracts/build/contracts/IERC20.json");

const cometABI = require('../ABIs/cometABI.json');
const aaveV3PoolABI = require('../ABIs/aaveV3PoolABI.json');
const getAPY = require('../helpers/getAPY.js');

const WETH_Address = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
const cWETHv3 = '0xA17581A9E3356d9A858b789D68B4d866e593aE94';
const aaveV3Pool = '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2'; // I think this is right

describe("Aggregator", function () {
  let WETH;
  

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();
    Aggregator = await ethers.getContractFactory("Aggregator");
    aggregator = await Aggregator.deploy();
    await aggregator.deployed();

    WETH = new ethers.Contract(WETH_Address, IERC20_ABI, owner);
    cometWETH_Contract = new ethers.Contract(WETH_Address, cometABI.abi, owner);
    cWETHv3_Contract = new ethers.Contract(cWETHv3, cometABI.abi, owner);
    aaveV3Pool_contract = new ethers.Contract(aaveV3Pool, aaveV3PoolABI, owner);
  });

  it("gets WETH", async function () {
    const amount = ethers.utils.parseEther('20');
    await owner.sendTransaction({
      to: WETH.address,
      value: amount
    });
    const WETH_Balance = await WETH.balanceOf(owner.address)
    expect(WETH_Balance.toString()).to.equal('20000000000000000000');
  });

  describe('APY rates', async () => {

    it("fetches compound APY rate", async function () {
      const result = await getAPY.getCompoundAPY(cWETHv3_Contract);
      console.log(result);
      expect(result).to.not.equal(0);
    });

    it('fetches aave APY rate', async () => {
      let result = await getAPY.getAaveAPY(aaveV3Pool_contract)
      console.log(result)
      expect(result).to.not.equal(0);
    })

  });

  describe("deposits", async function () {
    let amount = 10;
    // let amountInWei = utils.parseEther(amount.toString());
    let compAPY, aaveAPY;
    let result;

      beforeEach(async function () {
        compAPY = await getAPY.getCompoundAPY(cWETHv3_Contract);
        aaveAPY = await getAPY.getAaveAPY(aaveV3Pool_contract)
      });

      it("deposit to aave", async function () {

        await WETH.approve(aggregator.address, ethers.utils.parseEther('15'));
        await WETH.transfer(aggregator.address, ethers.utils.parseEther('10'));
        tx = await aggregator._deposit_to_aave(ethers.utils.parseEther('10'));
        console.log(tx);
        console.log(WETH)
        

      });


        
  });

});