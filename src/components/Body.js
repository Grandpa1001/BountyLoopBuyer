import React from 'react';
import './../styles/Body.css';
import logo1 from './../assets/mazon.gif';
import logo2 from './../assets/logo.jpeg';


const Body = ({ metaMask }) => {
    return (
      <div>
        <div id="Body">
        <div id="logoText">
                <p>Jesteś w trakcie kupna</p> 
                <div id="paragraf">
                    <p>Produktu który wspiera</p> 
                </div>
                <div id="paragraf">
                    <p>Klikając kup</p> 
                    <p>Przelejesz krypto na smartcontract</p> 
                    Zasilając w ten sposób konto
                </div>
                <div id="paragraf">
                    akcji charytatywnej
                </div>
        </div>
        <img id="connectImg" src={logo1} alt="Connect1" />
        <img id="connectImg" src={logo2} alt="Connect2" />
      </div>
      </div>
    );
  }


export default Body;
