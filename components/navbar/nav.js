import React from 'react'
import Logo from './logo'
import NavLinks from './navLinks'
import LoginButton from './login'
export default function Nav() {
    return (
        <div className='flex justify-between items-center  mt-4 mx-10'>
            <Logo />
            <NavLinks />
            <LoginButton />
        </div>
    )
}

