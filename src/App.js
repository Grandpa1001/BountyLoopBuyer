import Header from './components/Header';
import Body from './components/Body';
import React, { useEffect, useState  } from 'react';
import { ethers } from "ethers";
import { nftContractAddress,boolDontMint, totalSupply, checkIDchain } from './config.js'
import NFT from './abis/Bountyloop.json';
import './styles/App.css';

const App = () => {
const [numMinted, setNumMinted] = useState(0) // ilość zmintowanych nft w kolekcji
let [amount, setAmount] = useState(1); // ilość do zminntowania

//#######################################################
  const [mintedNFT, setMintedNFT] = useState(0) //zmintowane przez account
  const [saleState, setsaleState] = useState(0)
  const [maxPerWallet, setmaxPerWallet] = useState(0)
  const [metamaskOwner, setmetamaskOwner] = useState(false)
  const [miningStatus, setMiningStatus] = useState(0)
  const [priceMint, setPriceMint] = useState(0)
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
                    //Weryfikacja state
                  let saleStateVariable = await nftContract.mintEnabled(); 
                  setsaleState(saleStateVariable);
                    //Minted supply
                  let priceMintTECH = await nftContract.price(); 
                  setPriceMint(priceMintTECH)

                  let numTotalSup = await nftContract.totalSupply();   
                  setNumMinted(numTotalSup.toString());

                  let mumMaxPerWallet = await nftContract.maxPerWallet();   // maxPerWallet
                  setmaxPerWallet(mumMaxPerWallet);

                  let connectUserMintNFT = await nftContract.balanceOf(accounts[0]);
                  console.log(accounts[0]+" zmintował : "+connectUserMintNFT+"/"+mumMaxPerWallet)
                  setMintedNFT(connectUserMintNFT);
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
    const mintCharacter = async () => {
      try {
          const { ethereum } = window
          if (ethereum) {
              const provider = new ethers.providers.Web3Provider(ethereum)
              const signer = provider.getSigner()

              const nftContract = new ethers.Contract(nftContractAddress,NFT,signer)

              const accounts = await ethereum.request({ method: 'eth_accounts' })
              //const gasLimit = 441810;
              let priceMintTECH = await nftContract.price(); 
              setPriceMint(priceMintTECH)

              

              let money= ethers.utils.parseEther((ethers.utils.formatEther(priceMint) * amount).toString());
              //const gasLimit = await nftContract.estimateGas.mint(amount, { value: money });
              //console.log('Estimated gas limit:', gasLimit);
              let checkFreeNFT = await nftContract.balanceOf(accounts[0]);
              console.log(amount.toString());
              if(parseInt(checkFreeNFT)===0 && parseInt(amount)===1){money=0}
              
              console.log('Mining....'+ money)
              let nftTx = await nftContract.mint(amount, { value: money});
              
              console.log('Mining....', nftTx.hash)
              
              setMiningStatus(1)
              let tx = await nftTx.wait()

              setMiningStatus(0)
              amount=1;
              console.log('Mined!', tx)
              let numTotalSup = await nftContract.totalSupply();    
              setNumMinted(numTotalSup.toString());
              checkIfWalletIsConnected();  
          
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
  parseInt(mintedNFT) < parseInt(maxPerWallet) && parseInt(numMinted) !== parseInt(totalSupply) && miningStatus === 0 ? 
<button onClick={mintCharacter} className="button"> 
  MINT
</button>
 : (miningStatus !== 1 ?  <div id="paidMintSoldOut" /> : <div id="minting" />)

);

//
const numberOfMintUI = () => (
  parseInt(mintedNFT) < parseInt(maxPerWallet) && parseInt(numMinted) !== parseInt(totalSupply) ? 
    <div id="amountBlock">
        <button onClick={minusAmount} id="buttonCountMinus">-</button>
        <div id="amountLabel">{amount}</div>
        <button onClick={addAmount} id="buttonCount">+</button>
    </div>
      : parseInt(numMinted) !== parseInt(totalSupply) ? <div id="endOfMintCharacter" />  : <div id="endOfMint" />  //
    );

    const addAmount = () => {
        let numCanMint;
        if(maxPerWallet-mintedNFT>=5){numCanMint =5}else{numCanMint =maxPerWallet-mintedNFT};
         
        if(numCanMint > amount){
            setAmount(amount +1)
        }

      };
      
      const minusAmount = () => {

        if(amount >1){
            setAmount(amount -1)
        }
      };

const howManyMinted = () => (
    
    <div id="labelMint">
    {numMinted} / {totalSupply}
    </div>
  )

  const mintUI =() => (
    <div>
        <div id="buttonGrid"> 
         {currentAccount === "" ? renderNotConnectedContainer() : numberOfMintUI()}
        </div>
        <div id="buttonGrid">
         {currentAccount === "" ? "" : renderMintUI()}
        </div>
        <div id="buttonGrid2">
         {currentAccount === "" ? "" : howManyMinted()}
        </div>
    </div>

)

  const showButtons = () => (

    saleState === false? "" : (saleState === true  ? mintUI() :  "") 
    )

    return (
      <div id="App">
      <Header currentAccount={currentAccount} saleState={saleState}/>   
      <Body saleState={saleState} metaMask={currentAccount}/>
      {correctNetwork === false &&  currentAccount !== ""? <div id="buttonGrid2"><div id="labelMint">ERROR CHAIN - Change chain to Ethereum</div></div> : ""} 
      {metamaskOwner === true ? ( currentAccount === "" ? renderNotConnectedContainer() : "") : <div id="metamaskEmpty" /> }
      {boolDontMint === true ? "" : showButtons()} 
      <div id="errorMSG">{txError}</div> 
      </div>
    );
  
}

export default App;
