import Header from './components/Header';
import React, { useEffect, useState, useCallback  } from 'react';
import { ethers } from "ethers";
import axios from 'axios';
import { nftContractAddress, checkIDchain } from './config.js'
import NFT from './abis/Bountyloop.json';
import './styles/App.css';
import logo2 from './assets/logo.jpeg';


const App = () => {

//#######################################################
  const [metamaskOwner, setmetamaskOwner] = useState(false)
  const [txError, setTxError] = useState(null)
  const [camp, setCamp] = useState('')
  const [param, setParam] = useState('')
  const [kwota, setKwota] = useState('')
  const [paramSKU, setParamSKU] = useState('')
  const [kurs, setKurs] = useState(0)
  const [zdjecieProduktu, setZdjecieProduktu] = useState(0)
  const [payStatus, setPayStatus] = useState(0)
  const [currentAccount, setCurrentAccount] = useState('')
  const [zaplacone, setZaplacone] = useState(false)
  const [correctNetwork, setCorrectNetwork] = useState(false)

  
  const data = {
    products: [
      { id: 1, symbol: "ERO921", name: "PGNiG", price: 67.99, url: "https://res.cloudinary.com/glide/image/fetch/f_auto,w_500,c_limit/https%3A%2F%2Fstorage.googleapis.com%2Fglide-prod.appspot.com%2Fuploads-v2%2FE2f4NOk6eUqYE7KZAnNM%2Fpub%2FD8lkaKyQoQzx45zdqcxX.jpg" },
      { id: 2, symbol: "ERO-CC1", name:"NeXT Blue", price: 57.90, url: "https://res.cloudinary.com/glide/image/fetch/f_auto,w_500,c_limit/https%3A%2F%2Fstorage.googleapis.com%2Fglide-prod.appspot.com%2Fuploads-v2%2FE2f4NOk6eUqYE7KZAnNM%2Fpub%2FVDE90bjxNj9p5Pk0BiCI.jpg" },
    ],
  };


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
                  const queryParams = new URLSearchParams(window.location.search);
                  const campID = queryParams.get('campID');
                  const skuID = queryParams.get('SKU');
                  const findSymbol = data.products.find(product => product.symbol === skuID);
                  const cenaValue = findSymbol.price;
                  setZdjecieProduktu(findSymbol.url)
                  setKwota(cenaValue);

                  setParam(campID);
                  setParamSKU(skuID);
                  checkIfWalletIsConnected();
                   
      } catch (error) {
          console.log('Error connecting to metamask', error)
      }
  }


  const getKursETH = useCallback(() => {
    axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=pln')
      .then(response => {
        const ethPricePLN = response.data.ethereum.pln;
        let ethPriceETHPLN = (kwota / ethPricePLN).toFixed(4);
        if (ethPriceETHPLN !== "") {
          setKurs(`${ethPriceETHPLN}`);
        }
      });
  }, [kwota]);




        // Checks if wallet is connected
    const checkIfWalletIsConnected = useCallback (async () => {
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
                  const findSymbol = data.products.find(product => product.symbol === skuID.toString());
                  const cenaValue = findSymbol.price;
                  setZdjecieProduktu(findSymbol.url)
                  setKwota(cenaValue)
                  console.log(campID)
                  setParam(campID);
                  setParamSKU(skuID);
                  const techCamp = await nftContract.getCampaign(campID)
                  setCamp(techCamp) 
              } else {
                  console.log('No authorized account found')
                  //setCurrentAccount("");
              }

          } else {
              console.log('No Wallet found. Connect Wallet')
              setmetamaskOwner(false);
          }
    
      },[data.products])

  //setInterval(checkIfWalletIsConnected, 5000);

  

useEffect(() => {
    const interval = setInterval(() => {
        const isZaplacone = localStorage.getItem('zaplacone');
        if (isZaplacone) {
          setZaplacone(true);
        }
      checkIfWalletIsConnected();
      getKursETH();
    }, 5000);
  
    return () => {
      clearInterval(interval);
    };
  }, [checkIfWalletIsConnected, getKursETH]);

    const pay = async () => {
      try {
        setTxError("")
          const { ethereum } = window
          if (ethereum) {
          console.log("pay");
          const provider = new ethers.providers.Web3Provider(ethereum)
          const signer = provider.getSigner()
          const nftContract = new ethers.Contract(nftContractAddress, NFT, signer)
          let money= ethers.utils.parseEther(kurs.toString());
          console.log('Platnosc....'+ money)
          let nftTx = await nftContract.donateToCampaign(param, { value: money});
          
          console.log('Platnosc trwa....', nftTx.hash)
          
          setPayStatus(1)
          let tx = await nftTx.wait()
          setZaplacone(true)
          localStorage.setItem('zaplacone', true);
          setPayStatus(0)

          console.log('Zaplacono!', tx)

          } else {
              console.log("Ethereum object doesn't exist!")
          }
      } catch (error) {
          console.log('Error pay', error)
          setTxError(error.message)
          
      }
      
  }

  

//########################################################
//FRONT

const renderNotConnectedContainer = () => (
    <div id="buttonGrid">
        <button onClick={connectWallet} className="button pulse" >
        Połącz portfel
      </button>
</div>
);

const renderMintUI = () => (  
<div>
<div id="logoTextCenter">
                <p>{kwota} PLN</p>
                <p>{kurs} ETH</p> 
        </div> 
        
  {payStatus === 1 ? (

<div id="buttonGrid"> 
  <button href="#" className="button block">
  <div className="wrapper">
  <span className="circle circle-1"></span>
  <span className="circle circle-2"></span>
  <span className="circle circle-3"></span>
  <span className="circle circle-4"></span>
  <span className="circle circle-5"></span>
  <span className="circle circle-6"></span>
</div>
Trwa płatność
  </button>
</div>)
: ( 
<div id="buttonGrid"> 
  <button href="#" className="button pulse" onClick={pay}>
    Zapłać
  </button>
</div>)}

</div>
);


const campValue = () => (    
    <div>
    <div id="Body">
    <div id="bodySlotGrid">
        <div id="logoText">
                <p>Produkt</p> 
                <p><b>{paramSKU}</b></p> 
                <p>Kategoria</p>
                <p><b>{camp.title}</b></p>
        </div> 
    </div>
    <div id="bodySlotGrid">
        <div className="okragla-kontrolka">
            <img src={zdjecieProduktu} alt="Zdjęcie" />
        </div>
    </div>
    <div id="bodySlotGrid">
    <img id="connectImg" src={logo2} alt="Connect2" />
    </div>
  </div>
  </div>
  );


const zaplaconoView =() => (
    <div>
        <div id="exitView">
        <img id="connectImg" src={logo2} alt="Connect2" />
            <div id="introView">
                Produkt został poprawnie opłacony!
            </div>

            </div>
    </div>
)

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
      
      {metamaskOwner === true ? ( currentAccount === "" ? noLogView() : (   zaplacone ===true ? zaplaconoView() : campValue()) ) : ""}
      {correctNetwork === false &&  currentAccount !== ""? <div id="buttonGrid2"><div id="labelMint">ERROR CHAIN - Change chain to Ethereum</div></div> : ""} 
      <div>
      {metamaskOwner === true ? ( currentAccount === "" ? renderNotConnectedContainer() : (zaplacone === false ? renderMintUI() : "") ) : <div id="metamaskEmpty" /> }
      </div>
      <div id="errorMSG">{txError}</div> 

      </div>
    );
  
}

export default App;
