import Link from 'next/link'
import React from 'react'
export default function Logo() {
    return (
        <div>
            <Link href={'/'}><h2 className='text-secondary'>Reflective</h2></Link>
        </div>
    )
}
