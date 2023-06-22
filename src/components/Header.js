import React from 'react';
import './../styles/Header.css';

import adress from './../assets/adress.png';






//class Header extends Component {
  const Header = ({ currentAccount}) => {
    return (
    <div id="Header" >
      {currentAccount !== "" ?
      <div id="walletContainer">
      <img id="logo" src={adress} alt="Logo" />
      <div id="wallet">{currentAccount.substring(0, 6) + "..." + currentAccount.substring(currentAccount.length - 6)}</div>
      </div>
      : null
      }
    </div>
    );
  }


export default Header;
