import './App.css';
import { Button, Box, Typography, TextField, Grid } from "@mui/material";
import { useEffect, useState } from 'react';
import { getBlockchain, showError } from './utils/common'
import { ethers } from 'ethers';
import NavBar from "./components/navbar.js";
import Aggregator from './components/aggregator';



function App() {

  const [blockchain, setBlockchain] = useState({});

  useEffect(() => {
    (async () => {
      setBlockchain(await getBlockchain());
    })();
  },[]);

  return (
    <div >
    <NavBar />
    <Aggregator blockchain={blockchain} />
    
    

    </div>
  );
}

export default App;
