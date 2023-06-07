import './App.css';
import { useEffect, useState } from 'react';
import { getBlockchain } from './utils/common'
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
