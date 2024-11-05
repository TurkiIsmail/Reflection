import React from 'react'
import Link from 'next/link'
export default function Login() {
    return (
        <div>
            <Link href={"/signin"}><button className=' text-white/90 hover:text-white mr-3 duration-300   text-sm   '>Sign In</button></Link>
            <Link href={"/login"}><button className=' text-white border duration-300 hover:bg-white hover:text-black px-4 text-sm py-1 font-semibold  rounded-md'>Log In</button></Link>
        </div>
    )
}
