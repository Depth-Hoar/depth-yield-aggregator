import './App.css';
import { useEffect, useState } from 'react';
import { getBlockchain } from './utils/common'
import { ethers } from 'ethers';
import NavBar from "./components/navbar.js";


function App() {

  // const [blockchain, setBlockchain] = useState({});

  // useEffect(() => {
  //   (async () => {
  //     setBlockchain(await getBlockchain());
  //   })();
  // }, []);

  return (
    <div >
    <NavBar />
    

    </div>
  );
}

export default App;
