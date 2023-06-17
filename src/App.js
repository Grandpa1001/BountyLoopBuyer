import Header from './components/Header';
import React, { useEffect, useState  } from 'react';
import { ethers } from "ethers";
import { nftContractAddress, checkIDchain } from './config.js'
import NFT from './abis/Bountyloop.json';
import './styles/App.css';
import logo1 from './assets/koszulka.jpeg';
import logo2 from './assets/logo.png';


const App = () => {

//#######################################################
  const [metamaskOwner, setmetamaskOwner] = useState(false)
  const [txError, setTxError] = useState(null)
  const [camp, setCamp] = useState('')
  const [param, setParam] = useState('')
  const [kwota, setKwota] = useState('')
  const [paramSKU, setParamSKU] = useState('')
  const [countCamp, setCountCamp] = useState(0)
  const [payStatus, setPayStatus] = useState(0)
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
                  const queryParams = new URLSearchParams(window.location.search);
                  const campID = queryParams.get('campID');
                  const skuID = queryParams.get('SKU');
                  const cenaId = queryParams.get('m');
                  let cenaValue = cenaId.replace("A","1")
                  cenaValue = cenaValue.replace("B","2")
                  cenaValue = cenaValue.replace("C","3")
                  cenaValue = cenaValue.replace("D","4")
                  cenaValue = cenaValue.replace("E","5")
                  cenaValue = cenaValue.replace("F","6")
                  cenaValue = cenaValue.replace("G","7")
                  cenaValue = cenaValue.replace("H","8")
                  cenaValue = cenaValue.replace("I","9")
                  cenaValue = cenaValue.replace("J","0")
                  cenaValue = cenaValue.replace("K",",")
                  setKwota(cenaValue)
                  setParam(campID);
                  setParamSKU(skuID);
                  const techCamp = await nftContract.getCampaign(campID)
                  setCamp(techCamp)
                  
                  let techCount = await nftContract._campaignCount()
                  setCountCamp(techCount.toString())
                


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

    const pay = async () => {
      try {
          const { ethereum } = window
          if (ethereum) {
          console.log("pay");
          const provider = new ethers.providers.Web3Provider(ethereum)
          const signer = provider.getSigner()
          const nftContract = new ethers.Contract(nftContractAddress, NFT, signer)
          let money= ethers.utils.parseEther("0.01"); 
          console.log('Platnosc....'+ money)
          let nftTx = await nftContract.donateToCampaign(param, { value: money});
          
          console.log('Platnosc trwa....', nftTx.hash)
          
          setPayStatus(1)
          let tx = await nftTx.wait()

          setPayStatus(0)

          console.log('Zaplacono!', tx)

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
        <button onClick={connectWallet} class="button pulse" >
        Połącz portfel
      </button>
</div>
);

const renderMintUI = () => (  
<div>
<div id="logoTextCenter">
                <p><b>{kwota} PLN</b></p> 
        </div> 
  <div id="buttonGrid"> 
  <button href="#" class="button pulse" onClick={pay}>
    Zapłać
  </button>
</div>
<div id="errorMSG">
    <p>Tym zakupem wspierasz akcje charytatywne z kategorii: {camp.title}</p>
    </div>
</div>
);


const campValue = () => (    
    <div>
    <div id="Body">
    <div id="bodySlotGrid">
        <div id="logoText">
                <p>Produkt</p> 
                <p><b>{paramSKU}</b></p> 
        </div> 
    </div>
    <div id="bodySlotGrid">
        <div class="okragla-kontrolka">
            <img src={logo1} alt="Zdjęcie" />
        </div>
    </div>
    <div id="bodySlotGrid">
    <img id="connectImg" src={logo2} alt="Connect2" />
    </div>
  </div>
  </div>
  );


  const noLogView= () => (    
    <div>
        <div id="introGrid">
            <div id="introView">
                Witaj na stronie BountyLoop Pay
            </div>
        </div>
        <div id="introGrid">
        <img id="introImgView" src={logo2} alt="Connect2" />
        </div>
  </div>
  );


    return (
      <div id="App">

      <Header currentAccount={currentAccount} />   
      
      {metamaskOwner === true ? ( currentAccount === "" ? noLogView() : campValue() ) : ""}
      {correctNetwork === false &&  currentAccount !== ""? <div id="buttonGrid2"><div id="labelMint">ERROR CHAIN - Change chain to Ethereum</div></div> : ""} 
      <div>
      {metamaskOwner === true ? ( currentAccount === "" ? renderNotConnectedContainer() : renderMintUI() ) : <div id="metamaskEmpty" /> }
      </div>
      <div id="errorMSG">{txError}</div> 

      {payStatus === 1 ? <div id="errorMSG">TRWA PLATNOSC</div> : ""}
      </div>
    );
  
}

export default App;
