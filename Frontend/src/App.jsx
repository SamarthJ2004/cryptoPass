import React,{useState,useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import './styles/nft.css';
import Background from './components/Background.jsx';
import MainContent from './components/MainContent.jsx';
import Organiser from './components/Organiser.jsx';
import User from "./components/User.jsx";
import EventDetails from "./components/EventDetails.jsx";
import { SEPOLIA_ID } from './config';

function App() {
  const [currentAccount, setCurrentAccount] = useState('');

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Metamask not detected');
        window.alert("Connect to Metamask");
        window.location = "https://metamask.io/";
        return;
      }

      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log('Connected to chain:' + chainId);
      const sepoliaChainId = SEPOLIA_ID;

      if (chainId !== sepoliaChainId) {
        alert('You are not connected to the Sepolia Testnet!');
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

      console.log('Found account', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log('Error connecting to metamask', error);
    }
  };

  const checkCorrectNetwork = async () => {
    const { ethereum } = window;
    if (!ethereum) return;

    let chainId = await ethereum.request({ method: 'eth_chainId' });
    console.log('Connected to chain:' + chainId);
  };

  useEffect(() => {
    if (currentAccount) {
      checkCorrectNetwork();
    }
  }, [currentAccount]);

  useEffect(()=>{
    connectWallet();
  },[])
  
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <>
              <Navbar account={currentAccount}/>
              <Background />
              <MainContent />
            </>
          } />
          <Route path="/create-event" element={<Organiser currentAccount={currentAccount}/>} />
          <Route path="/user" element={<User />}/>
          <Route path="/event-detail" element={<EventDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;