require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
// const privateKey = process.env.PRIVATE_KEY
// const alchemyKey = process.env.ALCHEMY_API_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    hardhat: {
      forking: {
        url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      }
    },
    // mainnet: {
    //   url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    //   accounts: [privateKey],
    //   chainId: 1,
    //   gasPrice: 30000000000,
    //   timeout: 30000
    // }
  }
};
