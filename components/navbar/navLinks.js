import React from 'react'
import Link from 'next/link'
export default function NavLinks() {
    return (
        <div className='flex justify-between text-md font-normal items-center sm:1/3   w-1/4 text-white/70'>
            <Link href={'/'}><p className='hover:text-white duration-300 sm:text-sm'>Archive</p></Link>
            <Link href={'/'}><p className='hover:text-white duration-300 sm:text-sm'>Calendar</p></Link>
            <Link href={'/'}><p className='hover:text-white duration-300 sm:text-sm'>Settings</p></Link>
        </div>
    )
}
