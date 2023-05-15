import React from 'react'
import { Link } from 'react-router-dom';
import { ConnectWallet } from "@thirdweb-dev/react";

const NavBar = (props) => {
  return (
    <nav className="navbar navbar-dark bg-primary">
        <h3 className=' ps-4 text-light' >{props.title}</h3>
      
        <div className='pe-4'>
          {props.hideWallet ?  "" : <ConnectWallet accentColor='black' colorMode='light' />  }
        </div>
    </nav>
  )
}

export default NavBar