import React from 'react'
import { ConnectWallet } from "@thirdweb-dev/react";

const NavBar = (prop) => {
  return (
    <nav className="navbar navbar-dark bg-primary justify-content-between">
        <h3 className=' ps-4 text-light' >{prop.title}</h3>
        <div className='pe-4'>
          <ConnectWallet accentColor='black' colorMode='light' />
        </div>
    </nav>
  )
}

export default NavBar