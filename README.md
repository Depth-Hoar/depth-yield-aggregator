# Yield Aggregator

This project uses CompoundV3 and AaveV3 to get the best yields of the two. Deposit WETH into this DAPP and get get the better APY you can deposit withdraw and rebalance.

## Walk Through and Screencast Video

[https://youtu.be/y_Cu5Ou7kvQ](https://youtu.be/y_Cu5Ou7kvQ)

## Technology Stack & Tools

- Solidity (Writing Smart Contracts & Tests)
- Javascript (React & Testing)
- [Hardhat](https://hardhat.org/) (Development Framework)
- [Ethers.js](https://docs.ethers.io/v5/) (Blockchain Interaction)
- [React.js](https://reactjs.org/) (Frontend Framework)
- [MaterialUI](https://mui.com/material-ui/) (React Components)

## Requirements For Initial Setup

- Install [NodeJS](https://nodejs.org/en/)
- Install [Metamask](https://metamask.io/)
- Get an Alchemy API Key sign up [here](https://www.alchemy.com/)

## Setting Up

1. Create a `.env` file use `example.env` template to make it. You will also need to get an Alchemy API key and add that to the ENV file.

2. Start a [local node](https://hardhat.org/getting-started/#connecting-a-wallet-or-dapp-to-hardhat-network)
   Hardhat is a blockchain development toolkit used to compile your solidity files, run tests and run a local blockchain node. Open a new terminal and start the node.

```shell
npm install, npx hardhat node
```

3. Open a new terminal and deploy the smart contract in the `localhost` network

```shell
npx hardhat run --network localhost scripts/deploy.js
```

4. Get WETH in your wallet. Running this script will turn 100 ETH to 100 WETH

```shell
npx hardhat run --network localhost scripts/getWETH.js
```

5. The frontend is built using `create-react-app` To start the frontend run

```shell
cd frontend, npm install, npm start
```

## Run tests

```shell
npx hardhat test
```
