import React from 'react';
import './../styles/Header.css';
import logo1 from './../assets/tt.png';
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
      <div id="logoNameContainer">
      <div id="Label">BountyLoop</div>
      <a href="https://twitter.com/BountyLoop"><img id="logo" src={logo1} alt="Logo"/></a>
      </div>
    </div>
    );
  }


export default Header;
