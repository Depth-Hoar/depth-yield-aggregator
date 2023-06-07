# Yield Aggregator

This project uses CompoundV3 and AaveV3 to get the best yields of the two. Deposit WETH into this DAPP and get get the better APY you can deposit withdraw and rebalance.

1. The frontend is built using `create-react-app` To start the frontend run

```shell
cd frontend, npm install, npm start
```

2. Create a `.env` file use `example.env` template to make it. You will also need to get an Alchemy API key and add that to the ENV file.

3. Start a [local node](https://hardhat.org/getting-started/#connecting-a-wallet-or-dapp-to-hardhat-network)
   Hardhat is a blockchain development toolkit used to compile your solidity files, run tests and run a local blockchain node. Open a new terminal and start the node.

```shell
npm install, npx hardhat node
```

4. Open a new terminal and deploy the smart contract in the `localhost` network

```shell
npx hardhat run --network localhost scripts/deploy.js
```

5. Get WETH in your wallet. Running this script will turn 100 ETH to 100 WETH

```shell
npx hardhat run --network localhost scripts/getWETH.js
```

run tests

```shell
npx hardhat test
```
