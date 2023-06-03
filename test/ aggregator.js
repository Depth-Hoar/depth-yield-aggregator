const { expect } = require("chai");
const { ethers } = require("hardhat");

const daiABI = require('../ABIs/daiABI.json');
const cometABI = require('../ABIs/cometABI.json');
const aaveV3PoolABI = require('../ABIs/aaveV3PoolABI.json');
const getAPY = require('../helpers/getAPY.js');

const DAI = '0x6b175474e89094c44da98b954eedeac495271d0f';
const cWETHv3 = '0xA17581A9E3356d9A858b789D68B4d866e593aE94';
const aaveV3Pool = '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2'; // I think this is right

describe("Aggregator", function () {

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();
  
    Aggregator = await ethers.getContractFactory("Aggregator");
    aggregator = await Aggregator.deploy();
    await aggregator.deployed();

    daiContract = new ethers.Contract(DAI, daiABI.abi, owner);
    cUSDC_Contract = new ethers.Contract(cWETHv3, cometABI.abi, owner);
    aaveLendingPool_contract = new ethers.Contract(aaveV3Pool, aaveV3PoolABI, owner);
    
    // console.log(cdaiContract);
  });

  it("fetches compound exchange rate", async function () {
    const result = await getAPY.getCompoundAPY(cUSDC_Contract);
    console.log(result);
    expect(result).to.not.equal(0);
    });

});