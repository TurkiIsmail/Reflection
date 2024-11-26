import React from 'react'
import Link from 'next/link'
export default function NavLinks() {
    return (
        <div className=' justify-between text-md font-normal items-center min-[360px]:hidden md:flex sm:w-1/3   md:w-1/4 text-white/70'>
            <Link href={'/'}><p className='hover:text-white duration-300 sm:text-sm min-[360px]:text-xs'>Archive</p></Link>
            <Link href={'/'}><p className='hover:text-white duration-300 sm:text-sm min-[360px]:text-xs'>Calendar</p></Link>
            <Link href={'/'}><p className='hover:text-white duration-300 sm:text-sm min-[360px]:text-xs'>Settings</p></Link>
        </div>
    )
}
