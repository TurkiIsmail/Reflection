import React from 'react'
import Link from 'next/link'
export default function NavLinks() {
    return (
        <div className='flex justify-between text-md font-normal   w-1/4 text-white/70'>
            <Link href={'/'}><p className='hover:text-white duration-300'>Archive</p></Link>
            <Link href={'/'}><p className='hover:text-white duration-300'>Calendar</p></Link>
            <Link href={'/'}><p className='hover:text-white duration-300'>Settings</p></Link>
        </div>
    )
}
