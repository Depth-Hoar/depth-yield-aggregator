import './App.css';
import { Button, Box, Typography, TextField, Grid } from "@mui/material";
import { useEffect, useState } from 'react';
import { getBlockchain, showError } from './utils/common'
import { ethers } from 'ethers';
import NavBar from "./components/navbar.js";



function App() {

  const [blockchain, setBlockchain] = useState({});

  const [show, setShow] = useState(false);
  
  const handleClose = () => {
    setShow(false);
  };

  useEffect(() => {
    (async () => {
      setBlockchain(await getBlockchain());
    })();
  }, []);

  console.log(blockchain.aggregator);

  // const depositToAggregator = async (e) => {
  //   e.preventDefault();
  //   if (window.ethereum) {
  //     try {
  //     // await Escrow.depositToEscrow({ value: parseEth(amount) });
  //     // await Escrow.totalEscrowBalance();
  //   } 
  //   catch (error) {
  //     showError(error);
  //   }
  //   handleClose();
  // }};

  return (
    <div >
    <NavBar />
    <Box sx={{p:10}}>
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <form noValidate autoComplete='off' onSubmit='{handleSubmit}' >
      <Grid item>
        <TextField 
          // onChange={(e) => setEscrow(e.target.value)}
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
    </Grid>
    </Box>
    

    </div>
  );
}

export default App;
