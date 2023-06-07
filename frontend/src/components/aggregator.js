import { showError } from '../utils/common'
import { Button, Box, Typography, TextField, Grid } from "@mui/material";
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import getAPY from '../helpers/getAPY.js';
import aaveV3PoolABI from '../ABIs/aaveV3poolABI.json';
import cometABI from '../ABIs/cometABI.json';


const { abi: IERC20_ABI } = require("@openzeppelin/contracts/build/contracts/IERC20.json");

function Aggregator({ blockchain }) {

  const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  const aaveV3Pool = '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2';
  const cWETHv3 = '0xA17581A9E3356d9A858b789D68B4d866e593aE94';
  const WETH_ABI = IERC20_ABI;
  const [show, setShow] = useState(false);
  const [whereBalance, setWhereBalance] = useState();
  const [depositAmount, setDepositAmount] = useState('');
  const [WETHBalance, setWETHBalance] = useState();
  const [depositBalance, setDepositBalance] = useState('');
  const [WETHContract, setWETHContract] = useState(null);
  const [compAPY, setCompAPY] = useState();
  const [aaveAPY, setAaveAPY] = useState();

  useEffect(() => {
    (async () => {
      if (!blockchain.aggregator) {
        return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const WETHInstance = new ethers.Contract(WETH_ADDRESS, WETH_ABI, signer);
      const balance = await WETHInstance.balanceOf(blockchain.signerAddress);
      const cWETHv3_Contract = new ethers.Contract(cWETHv3, cometABI.abi, signer);
      const aaveV3Pool_contract = new ethers.Contract(aaveV3Pool, aaveV3PoolABI, signer);
      setWETHBalance(ethers.utils.formatEther(balance));
      setDepositBalance(ethers.utils.formatEther(await blockchain.aggregator.connect(signer).depositBalance()));
      setWhereBalance(await blockchain.aggregator.whereBalance());
      setWETHContract(WETHInstance);
      // APY
      const compAPY = await getAPY.getCompoundAPY(cWETHv3_Contract);
      const aaveAPY = await getAPY.getAaveAPY(aaveV3Pool_contract);
      setCompAPY(compAPY);
      setAaveAPY(aaveAPY);

    })();
  },[blockchain, WETH_ABI]);
  
  const handleClose = () => {
    setShow(false);
  };



  const depositToAggregator = async (e) => {
    e.preventDefault();
    if (window.ethereum) {
      try {
        const parsedDepositAmount = ethers.utils.parseUnits(depositAmount, 'ether');
        // approve the aggregator to spend WETH on user's behalf
        const approveTx = await WETHContract.approve(blockchain.aggregator.address, parsedDepositAmount);
        await approveTx.wait();

        // call the deposit function in the aggregator
        const depositTx = await blockchain.aggregator.connect(WETHContract.signer).deposit(parsedDepositAmount, Math.round(compAPY * 100), Math.round(aaveAPY * 100));
        await depositTx.wait();
      } 
      catch (error) {
        showError(error);
      }
      handleClose();
  }};

  const withdrawFromAggregator = async () => {
    try {
      // Call the withdraw function from the Aggregator contract
      const withdrawTx = await blockchain.aggregator.connect(WETHContract.signer).withdraw();
      await withdrawTx.wait();
    } 
    catch (error) {
      showError(error);
    }
  };
  
  const rebalanceAggregator = async () => {
    try {
      // Call the rebalance function from the Aggregator contract
      const rebalanceTx = await blockchain.aggregator.connect(WETHContract.signer).rebalance(Math.round(compAPY * 100), Math.round(aaveAPY * 100));
      await rebalanceTx.wait();
    } 
    catch (error) {
      showError(error);
    }
  };

  return (
    <div >
      <Box sx={{p:10}}>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <form noValidate autoComplete='off' onSubmit={depositToAggregator}>
          <Grid item>
            <TextField 
              onChange={(e) => setDepositAmount(e.target.value)}
              sx={{ m: 1, width: '42ch' }}
              id="outlined-basic" 
              label="Deposit Amount" 
              variant="outlined"
              required
            />
            </Grid>
            <Grid item>
              <Button 
                type='submit'
                variant='contained'>
                Deposit
              </Button>
            </Grid>
          </form>

          <Grid item>
            <Button 
              onClick={withdrawFromAggregator}
              variant='contained'>
              Withdraw
            </Button>
          </Grid>

          <Grid item>
            <Button 
              type='submit'
              onClick={rebalanceAggregator}
              variant='contained'>
              Rebalance
            </Button>
          </Grid>

          <Box sx={{ padding: 5 }}>
              <Typography>
                    Active Protocol: {whereBalance}
                </Typography>
              <Typography>
                    WETH  Balance: {WETHBalance}: 
              </Typography>
              <Typography>
                    Amount Deposited to Aggregator: {depositBalance}: 
              </Typography>
              <Typography>
                    Compound APY: {compAPY}: 
              </Typography>
              <Typography>
                    Aave APY: {aaveAPY} 
              </Typography>
            </Box>
            
        </Grid>
      </Box>
    </div>
  );
}

export default Aggregator;