const { expect } = require("chai");
const { ethers } = require("hardhat");
const { abi: IERC20_ABI } = require("@openzeppelin/contracts/build/contracts/IERC20.json");

const cometABI = require('../ABIs/cometABI.json');
const aaveV3PoolABI = require('../ABIs/aaveV3PoolABI.json');
const getAPY = require('../frontend/src/helpers/getAPY.js');

const WETH_Address = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
const cWETHv3 = '0xA17581A9E3356d9A858b789D68B4d866e593aE94';
const aaveV3Pool = '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2';

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
    const amount = ethers.utils.parseEther('100');
    await owner.sendTransaction({
      to: WETH.address,
      value: amount
    });
    const WETH_Balance = await WETH.balanceOf(owner.address)
    expect(WETH_Balance.toString()).to.equal(ethers.utils.parseEther('100'));
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

  describe("Deposits", async function () {
    let compAPY, aaveAPY
    let deposit;
    let depositEvent

    beforeEach(async function () {
      compAPY = await getAPY.getCompoundAPY(cWETHv3_Contract);
      aaveAPY = await getAPY.getAaveAPY(aaveV3Pool_contract)
      await WETH.approve(aggregator.address, ethers.utils.parseEther('10'));
      deposit = await aggregator.deposit(ethers.utils.parseEther('10'), Math.round(compAPY * 100), Math.round(aaveAPY * 100));
    });

    it("tracks WETH balance", async function () {
      balance = await aggregator.depositAmount()
      expect(balance.toString()).to.equal(ethers.utils.parseEther('10'));
    });

    it("tracks where WETH is deposited", async function () {
      depositedTo = await aggregator.whereBalance()
      console.log('your WETH went here:', depositedTo)
    });

    it('emits deposit event', async () => {
      const receipt = await deposit.wait();

      if(receipt.events && receipt.events.length > 0){
        depositEvent = receipt.events.find(e => e.event === 'Deposit');
      } else {
        console.log('No events were emitted');
      }
      expect(depositEvent.event).to.equal('Deposit');
    })

    it('FAILS when transfer is not approved', async () => {
      await expect(aggregator.deposit(ethers.utils.parseEther('10'), Math.round(compAPY * 100), Math.round(aaveAPY * 100))).to.be.reverted;
    })
        
  });

  describe('Withdraws', async () => {
    let compAPY, aaveAPY
    let withdraw;

    beforeEach(async function () {
      compAPY = await getAPY.getCompoundAPY(cWETHv3_Contract);
      aaveAPY = await getAPY.getAaveAPY(aaveV3Pool_contract)
      await WETH.approve(aggregator.address, ethers.utils.parseEther('10'));
      await aggregator.deposit(ethers.utils.parseEther('10'), Math.round(compAPY * 100), Math.round(aaveAPY * 100));
      withdraw = await aggregator.withdraw();
    });

    it('emits withdraw event', async () => {
      const receipt = await withdraw.wait();
      if(receipt.events && receipt.events.length > 0){
        withdrawEvent = receipt.events.find(e => e.event === 'Withdraw');
        expect(withdrawEvent.event).to.equal('Withdraw');
      } else {
        console.log('No events were emitted');
      }
    });

    it('updates the user contract balance', async () => {
      depositAmount = await aggregator.depositAmount()
      expect(depositAmount.toString()).to.equal('0');
    })

    it('FAILS if another user attempts to withdraw', async () => {
      await expect(aggregator.connect(user).withdraw()).to.be.reverted;
    });

  });

  describe('Rebalance', async () => {
    let compAPY, aaveAPY
    let rebalance;

    beforeEach(async function () {
      compAPY = await getAPY.getCompoundAPY(cWETHv3_Contract);
      aaveAPY = await getAPY.getAaveAPY(aaveV3Pool_contract)
      await WETH.approve(aggregator.address, ethers.utils.parseEther('10'));
    });

    it('emits rebalance event', async () => {
      await aggregator.deposit(ethers.utils.parseEther('10'), Math.round(compAPY * 100), Math.round(aaveAPY * 100));
      rebalance = await aggregator.rebalance(Math.round(compAPY * 100), Math.round(aaveAPY * 100));
      const receipt = await rebalance.wait();
      if(receipt.events && receipt.events.length > 0){
        rebalanceEvent = receipt.events.find(e => e.event === 'Rebalance');
        expect(rebalanceEvent.event).to.equal('Rebalance');
      } else {
        console.log('No events were emitted');
      }
    });

    it('FAILS if owner has no deposit amount', async () => {
      await expect(aggregator.rebalance(Math.round(compAPY * 100), Math.round(aaveAPY * 100))).to.be.reverted;
    });

  });

});