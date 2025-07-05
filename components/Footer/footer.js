import React from 'react'
import { motion } from 'framer-motion'

export default function Footer() {
    return (
        <footer className="bg-neutral-700 w-full p-8 flex flex-col sm:flex-row flex-wrap gap-8 justify-between text-neutral-100 mt-20 sm:mt-0">
            <div className="flex-1 min-w-[180px] mb-6 sm:mb-0">
                <h3 className='font-bold mb-2'>Reflection</h3>
                <p className='mb-1'>A journaling & self-reflection app</p>
                <p className='text-xs text-neutral-300'>&copy; {new Date().getFullYear()} Reflection. All rights reserved.</p>
            </div>
            <div className="flex-1 min-w-[180px] mb-6 sm:mb-0">
                <h4 className='font-semibold mb-2'>Contact</h4>
                <p className='mb-1'>Email: <a href="mailto:support@reflection.app" className='hover:underline'>support@reflection.app</a></p>
                <p className='mb-1'>Twitter: <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className='hover:underline'>@reflectionapp</a></p>
            </div>
            <div className="flex-1 min-w-[180px]">
                <h4 className='font-semibold mb-2'>About</h4>
                <p className='mb-1'>Made with ❤️ for your growth.</p>
                <p className='text-xs text-neutral-400'>Built with Next.js & MongoDB</p>
            </div>
        </footer>
    )
}
