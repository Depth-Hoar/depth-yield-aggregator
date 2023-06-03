const { expect } = require("chai");
const { ethers } = require("hardhat");

const cometABI = require('../ABIs/cometABI.json');
const aaveV3PoolABI = require('../ABIs/aaveV3PoolABI.json');
const getAPY = require('../helpers/getAPY.js');

const cWETHv3 = '0xA17581A9E3356d9A858b789D68B4d866e593aE94';
const aaveV3Pool = '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2'; // I think this is right

describe("Aggregator", function () {

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();
  
    Aggregator = await ethers.getContractFactory("Aggregator");
    aggregator = await Aggregator.deploy();
    await aggregator.deployed();

    cWETHv3_Contract = new ethers.Contract(cWETHv3, cometABI.abi, owner);
    aaveV3Pool_contract = new ethers.Contract(aaveV3Pool, aaveV3PoolABI, owner);
  });

  it("fetches compound exchange rate", async function () {
    const result = await getAPY.getCompoundAPY(cWETHv3_Contract);
    console.log(result);
    expect(result).to.not.equal(0);
  });

  it('fetches aave exchange rate', async () => {
    let result = await getAPY.getAaveAPY(aaveV3Pool_contract)
    console.log(result)
    expect(result).to.not.equal(0);
})

});