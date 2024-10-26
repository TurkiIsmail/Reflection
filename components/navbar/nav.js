import React from 'react'
import Logo from './logo'
import NavLinks from './navLinks'
import LoginButton from './login'
export default function nav() {
    return (
        <div className='flex justify-between  mt-4 mx-10'>
            <Logo />
            <NavLinks />
            <LoginButton />
        </div >
    )
}

