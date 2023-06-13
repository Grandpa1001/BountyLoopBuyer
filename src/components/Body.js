import React from 'react';
import './../styles/Body.css';
import logo1 from './../assets/mazon.gif';
import logo2 from './../assets/logo.png';


const Body = ({ saleState, metaMask }) => {
    return (
      <div>
        <div id="Body">
        <div id="logoText">
                <p>A collection of 5000</p> 
                PFPs Cryptomazons,
                employees of the largest upcoming nft organization.
                <div id="paragraf">
                    <p>Max 1 free/ wallet</p> 
                    Rest 0,003
                </div>
                <div id="paragraf">
                    <p>Max 5/ transaction</p> 
                    <p>Max 10/wallet</p> 
                    100 reserved for team
                </div>
                <div id="paragraf">
                    Mint date: TBA 
                </div>
        </div>
        <img id="connectImg" src={logo1} alt="Connect1" />
        <img id="connectImg" src={logo2} alt="Connect2" />
      </div>
      </div>
    );
  }


export default Body;
