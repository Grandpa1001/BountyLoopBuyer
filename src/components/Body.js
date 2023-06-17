import React from 'react';
import './../styles/Body.css';
import logo1 from './../assets/koszulka.jpeg';
import logo2 from './../assets/logo.png';


const Body = ({ metaMask, camp }) => {
    return (
      <div>
        <div id="Body">
        <div id="logoText">
                <p>Jesteś w trakcie kupna</p> 
        </div>
        <img id="connectImg" src={logo1} alt="Connect1" />
        <img id="connectImg" src={logo2} alt="Connect2" />
      </div>
      </div>
    );
  }


export default Body;
