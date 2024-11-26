import React from 'react'
import Link from 'next/link'
export default function Login() {
    return (
        <div>
            <Link href={"/signin"}><button className=' text-white/90 hover:text-white mr-3 duration-300   sm:text-sm min-[360px]:text-xs  '>Sign In</button></Link>
            <Link href={"/login"}><button className=' text-white border duration-300 hover:bg-white hover:text-black px-4 min-[360px]:px-2 sm:text-sm min-[360px]:text-xs py-1 font-semibold  rounded-md'>Log In</button></Link>
        </div>
    )
}
