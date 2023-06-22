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
  const [nazwaProduktu, setNazwaProduktu] = useState('')
  const [paramSKU, setParamSKU] = useState('')
  const [kurs, setKurs] = useState(0)
  const [zdjecieProduktu, setZdjecieProduktu] = useState(0)
  const [payStatus, setPayStatus] = useState(0)
  const [currentAccount, setCurrentAccount] = useState('')
  const [zaplacone, setZaplacone] = useState(false)
  const [correctNetwork, setCorrectNetwork] = useState(false)
  const [loading, setLoading] = useState(true);
  
  const data = {
    products: [
      { id: 1, symbol: "ERO921", name: "PGNiG", price: 67.99, url: "https://res.cloudinary.com/glide/image/fetch/f_auto,w_500,c_limit/https%3A%2F%2Fstorage.googleapis.com%2Fglide-prod.appspot.com%2Fuploads-v2%2FE2f4NOk6eUqYE7KZAnNM%2Fpub%2FD8lkaKyQoQzx45zdqcxX.jpg" },
      { id: 2, symbol: "ERO-CC1", name:"NeXT Blue", price: 57.90, url: "https://res.cloudinary.com/glide/image/fetch/f_auto,w_500,c_limit/https%3A%2F%2Fstorage.googleapis.com%2Fglide-prod.appspot.com%2Fuploads-v2%2FE2f4NOk6eUqYE7KZAnNM%2Fpub%2FVDE90bjxNj9p5Pk0BiCI.jpg" },
      { id: 3, symbol: "SHEI01", name:"Shein Wolf", price: 48.50, url: "https://res.cloudinary.com/glide/image/fetch/f_auto,w_500,c_limit/https%3A%2F%2Fstorage.googleapis.com%2Fglide-prod.appspot.com%2Fuploads-v2%2FE2f4NOk6eUqYE7KZAnNM%2Fpub%2FkXSOKSmRL1RNLbULCe1j.jpeg"},
      { id: 4, symbol: "BLANK01", name:"Casula white", price: 19.99, url: "https://res.cloudinary.com/glide/image/fetch/f_auto,w_500,c_limit/https%3A%2F%2Fstorage.googleapis.com%2Fglide-prod.appspot.com%2Fuploads-v2%2FE2f4NOk6eUqYE7KZAnNM%2Fpub%2FnsAJz2ymYqLI7aUoML6w.webp"},
      { id: 5, symbol: "GAME01", name:"GamePad", price: 24.20, url: "https://res.cloudinary.com/glide/image/fetch/f_auto,w_500,c_limit/https%3A%2F%2Fstorage.googleapis.com%2Fglide-prod.appspot.com%2Fuploads-v2%2FE2f4NOk6eUqYE7KZAnNM%2Fpub%2F9ri0kDsXzKtNDHUpkuce.jpeg" },
      { id: 6, symbol: "SHEIP03", name:"Shein Pack black", price: 72.99, url: "https://res.cloudinary.com/glide/image/fetch/f_auto,w_500,c_limit/https%3A%2F%2Fstorage.googleapis.com%2Fglide-prod.appspot.com%2Fuploads-v2%2FE2f4NOk6eUqYE7KZAnNM%2Fpub%2FSEePFzoXHfAR3JuQT8MK.jpeg" },
      { id: 7, symbol: "HAEM01", name:"H&M sukienka green", price: 89.99, url: "https://res.cloudinary.com/glide/image/fetch/f_auto,w_500,c_limit/https%3A%2F%2Fstorage.googleapis.com%2Fglide-prod.appspot.com%2Fuploads-v2%2FE2f4NOk6eUqYE7KZAnNM%2Fpub%2FfIDw9UBoFDCQ93d6zvRV.jpeg" },
      { id: 8, symbol: "HAEM02", name:"H&M sukienka czarna", price: 89.99, url: "https://res.cloudinary.com/glide/image/fetch/f_auto,w_500,c_limit/https%3A%2F%2Fstorage.googleapis.com%2Fglide-prod.appspot.com%2Fuploads-v2%2FE2f4NOk6eUqYE7KZAnNM%2Fpub%2FxaQsDfALbPZGCPv3HsOw.jpeg" },
      { id: 9, symbol: "HAEM03", name:"H&M bluzka wyszywana", price: 99.99, url: "https://res.cloudinary.com/glide/image/fetch/f_auto,w_500,c_limit/https%3A%2F%2Fstorage.googleapis.com%2Fglide-prod.appspot.com%2Fuploads-v2%2FE2f4NOk6eUqYE7KZAnNM%2Fpub%2FbG7DgiJJchssJg9BcPoH.jpeg" },
      { id: 10, symbol: "HAEM04", name:"Falbaniasta spódnica mini", price: 79.99, url: "https://res.cloudinary.com/glide/image/fetch/f_auto,w_500,c_limit/https%3A%2F%2Fstorage.googleapis.com%2Fglide-prod.appspot.com%2Fuploads-v2%2FE2f4NOk6eUqYE7KZAnNM%2Fpub%2Fk3W4Y4qxldrVaaM7RMEC.jpeg" },
      { id: 11, symbol: "HAEM05", name:"Koszulka polo", price: 100.00, url: "https://res.cloudinary.com/glide/image/fetch/f_auto,w_500,c_limit/https%3A%2F%2Fstorage.googleapis.com%2Fglide-prod.appspot.com%2Fuploads-v2%2FE2f4NOk6eUqYE7KZAnNM%2Fpub%2Fw3t8LvIHjZOkBUc1KZE1.jpeg" },
      { id: 12, symbol: "BLNO2", name:"Koszulka biała zalando", price: 45.40, url: "https://res.cloudinary.com/glide/image/fetch/f_auto,w_500,c_limit/https%3A%2F%2Fstorage.googleapis.com%2Fglide-prod.appspot.com%2Fuploads-v2%2FE2f4NOk6eUqYE7KZAnNM%2Fpub%2FzwGsQbyIfPEgiHMolPTz.webp" },
      { id: 13, symbol: "BLN03", name:"Koszulka plaza biała", price: 52.20, url: "https://res.cloudinary.com/glide/image/fetch/f_auto,w_500,c_limit/https%3A%2F%2Fstorage.googleapis.com%2Fglide-prod.appspot.com%2Fuploads-v2%2FE2f4NOk6eUqYE7KZAnNM%2Fpub%2FIcYiERKM8cSkvpx5WaYE.jpeg" },
      { id: 14, symbol: "SPOD01", name:"Spodnie białe", price: 129.12, url: "https://res.cloudinary.com/glide/image/fetch/f_auto,w_500,c_limit/https%3A%2F%2Fstorage.googleapis.com%2Fglide-prod.appspot.com%2Fuploads-v2%2FE2f4NOk6eUqYE7KZAnNM%2Fpub%2ForNYeTuOZFyhdvR3AXcT.jpeg" },
      { id: 15, symbol: "BLUZ04", name:"Bluza zielona", price: 89.99, url: "https://res.cloudinary.com/glide/image/fetch/f_auto,w_500,c_limit/https%3A%2F%2Fstorage.googleapis.com%2Fglide-prod.appspot.com%2Fuploads-v2%2FE2f4NOk6eUqYE7KZAnNM%2Fpub%2FfIDw9UBoFDCQ93d6zvRV.jpeg" },
      { id: 16, symbol: "BLUZ05", name:"Bluza zielona niebieska", price: 76.20 , url: "https://res.cloudinary.com/glide/image/fetch/f_auto,w_500,c_limit/https%3A%2F%2Fstorage.googleapis.com%2Fglide-prod.appspot.com%2Fuploads-v2%2FE2f4NOk6eUqYE7KZAnNM%2Fpub%2FXBXryEq082PtBdz5QZM4.jpeg" },
      { id: 17, symbol: "KOSZ92", name:"Koszula kolorowa", price: 92.10, url: "https://res.cloudinary.com/glide/image/fetch/f_auto,w_500,c_limit/https%3A%2F%2Fstorage.googleapis.com%2Fglide-prod.appspot.com%2Fuploads-v2%2FE2f4NOk6eUqYE7KZAnNM%2Fpub%2F7TXXUSsmK1VJ8buyO3k7.jpeg" },
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
                  setNazwaProduktu(findSymbol.name)
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
        setLoading(false);
        const isZaplacone = localStorage.getItem('zaplacone');
        if (isZaplacone) {
          setZaplacone(true);
        }
      checkIfWalletIsConnected();
      getKursETH();
    }, 6000);
  
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
<p><b>Cena</b></p> 
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
  <div>
<div id="buttonGrid"> 
  <button href="#" className="button pulse" onClick={pay}>
    Zapłać
  </button>
</div>
<div id="dopisek">Zakupem wspierasz kategorie: <b>{camp.title}</b></div></div>)}

</div>
);


const campValue = () => (    
    <div>
    <div id="Body">
    <div id="bodySlotGrid">
        <div id="logoText">
                <div id="logoTextTitle"><p>Produkt</p></div> 
                <p><b>{nazwaProduktu}</b></p> 
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
        <img id="introImgView" src={logo2} alt="Connect2" />
        </div>
        <div id="introGrid">
            <div id="introView">
                Witaj na stronie BountyLoop Pay, by przejść dalej
            </div>
        </div>
  </div>
  );


    return (
      <div id="App">

      <Header currentAccount={currentAccount} />   
      {loading ? (
      <div id="loadingScreen">
        <div className="loadingScreenLabel">Przygotowanie płatności </div><div>-----</div>
        <div className="loadingAnimation"></div>
      </div>
    ) : null}
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
