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

    const sepoliaChainId = SEPOLIA_ID;

    setCorrectNetwork(chainId === sepoliaChainId);
  };