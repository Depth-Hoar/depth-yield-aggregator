import { showError } from '../utils/common'
import { Button, Box, Typography, TextField, Grid } from "@mui/material";
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const { abi: IERC20_ABI } = require("@openzeppelin/contracts/build/contracts/IERC20.json");


function Aggregator({ blockchain }) {

  const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  const WETH_ABI = IERC20_ABI;
  const [show, setShow] = useState(false);
  const [whereBalance, setWhereBalance] = useState();
  const [depositAmount, setDepositAmount] = useState('');
  const [WETHBalance, setWETHBalance] = useState();
  const [depositBalance, setDepositBalance] = useState('');
  const [WETHContract, setWETHContract] = useState(null);

  useEffect(() => {
    (async () => {
      if (!blockchain.aggregator) {
        return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const WETHInstance = new ethers.Contract(WETH_ADDRESS, WETH_ABI, signer);
      const balance = await WETHInstance.balanceOf(blockchain.signerAddress);
      setWETHBalance(ethers.utils.formatEther(balance));
      setDepositBalance(ethers.utils.formatEther(await blockchain.aggregator.connect(signer).depositBalance()));
      setWhereBalance(await blockchain.aggregator.whereBalance());
      setWETHContract(WETHInstance);
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
        // First, approve the aggregator to spend WETH on user's behalf
        const approveTx = await WETHContract.approve(blockchain.aggregator.address, parsedDepositAmount);
        await approveTx.wait();

        // Then call the deposit function in the aggregator
        const depositTx = await blockchain.aggregator.connect(WETHContract.signer).deposit(parsedDepositAmount,100000,300000);
        await depositTx.wait();
      } 
      catch (error) {
        showError(error);
      }
      handleClose();
  }};

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
          type='submit'
          variant='contained'>
          Withdraw
        </Button>
      </Grid>

      <Grid item>
        <Button 
          type='submit'
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
        </Box>
    </Grid>
    </Box>
    

    </div>
  );
}

export default Aggregator;