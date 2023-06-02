const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Aggregator", function () {

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();
  
    Aggregator = await ethers.getContractFactory("Aggregator");
  
    aggregator = await Aggregator.deploy();
    await aggregator.deployed();
  });

  it("block number", async function () {
  let blocknumber = await aggregator.connect(owner).getCurrentBlock();

    console.log(blocknumber);

  });

});