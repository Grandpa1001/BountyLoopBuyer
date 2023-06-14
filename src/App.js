import Header from './components/Header';
import Body from './components/Body';
import React, { useEffect, useState  } from 'react';
import { ethers } from "ethers";
import { nftContractAddress, checkIDchain } from './config.js'
import NFT from './abis/Bountyloop.json';
import './styles/App.css';

const App = () => {

//#######################################################
  const [metamaskOwner, setmetamaskOwner] = useState(false)
  const [txError, setTxError] = useState(null)
  const [currentAccount, setCurrentAccount] = useState('')
  const [correctNetwork, setCorrectNetwork] = useState(false)
  console.log("-------------USE STATE--------------");

  // Calls Metamask to connect wallet on clicking Connect Wallet button 
  const connectWallet = async () => {
      try {
          const { ethereum } = window
          if (!ethereum) {
              console.log('Metamask not detected')
              return
          }

          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: checkIDchain }],
         })
          const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
          console.log('Found account', accounts[0])
          setCurrentAccount(accounts[0])
          checkIfWalletIsConnected();
      } catch (error) {
          console.log('Error connecting to metamask', error)
      }
  }

        // Checks if wallet is connected
    const checkIfWalletIsConnected = async () => {
          const { ethereum } = window
          if (ethereum) {
              console.log('Got the ethereum obejct: ', ethereum)
              setmetamaskOwner(true);
              const accounts = await ethereum.request({ method: 'eth_accounts' })

  
              let chainId = await ethereum.request({ method: 'eth_chainId' })
              console.log('Connected to chain:' + chainId)

              if (chainId !== checkIDchain) {
                  setCorrectNetwork(false)
              } else {
                  setCorrectNetwork(true)
              }
              if (accounts.length !== 0) {
                  console.log('Found authorized Account: ', accounts[0])
                  setCurrentAccount(accounts[0])
                    //connect contract
                  const provider = new ethers.providers.Web3Provider(ethereum)
                  const signer = provider.getSigner()
                  const nftContract = new ethers.Contract(nftContractAddress, NFT, signer)
                  
              } else {
                  console.log('No authorized account found')

              }

          } else {
              console.log('No Wallet found. Connect Wallet')
              setmetamaskOwner(false);
          }
    
      }

  //setInterval(checkIfWalletIsConnected, 5000);

  useEffect(() => {
      checkIfWalletIsConnected();
  }, [])

    // Free mint State 1
    const pay = async () => {
      try {
          const { ethereum } = window
          if (ethereum) {
          console.log("pay");
          } else {
              console.log("Ethereum object doesn't exist!")
          }
      } catch (error) {
          console.log('Error minting character', error)
          setTxError(error.message)
          
      }
      
  }

//########################################################
//FRONT

const renderNotConnectedContainer = () => (
    <div id="buttonGrid">
        <button onClick={connectWallet} className="button">
        CONNECT
      </button>
</div>
);

const renderMintUI = () => (    
  <div id="buttonGrid"> 
  <button onClick={pay} className="button"> 
    Pay
  </button>
</div>
);


    return (
      <div id="App">
      <Header currentAccount={currentAccount} />   
      <Body metaMask={currentAccount}/>
      {correctNetwork === false &&  currentAccount !== ""? <div id="buttonGrid2"><div id="labelMint">ERROR CHAIN - Change chain to Ethereum</div></div> : ""} 
      {metamaskOwner === true ? ( currentAccount === "" ? renderNotConnectedContainer() : renderMintUI() ) : <div id="metamaskEmpty" /> }
      <div id="errorMSG">{txError}</div> 
      </div>
    );
  
}

export default App;
