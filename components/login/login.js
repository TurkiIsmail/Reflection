"use client"
import React from 'react'
import { Eye } from 'lucide-react'
import { EyeOff } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function login() {
    const fadeInAnimationVariants = {
        initial: {
            opacity: 0,
            x: 60,
        },
        animate: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.6,
                ease: "backOut",
            },
        },

    };
    const [passwordIcon, setPasswordIcon] = useState(false);
    return (

        <div className=' flex justify-center items-center  mx-8 mt-28'>
            <motion.form
                initial="initial"  // Specify the initial state
                whileInView={"animate"}
                viewport={{ once: true }}

                variants={fadeInAnimationVariants}
                className='w-2/3 md:w-[34%] lg:w-1/4  p-4   bg-neutral-600 rounded-lg'>
                <h1 className='text-center font-semibold mb-8 text-lg'>Login to Reflection</h1>
                <div>
                    <p className='mb-1  sm:text-sm md:text-xs text-sm'>Username</p>
                    <input type='text' placeholder="enter username" className='w-full p-2 outline-none bg-neutral-700 focus:bg-violet-500/30 duration-300 rounded text-sm mb-4' />
                </div>
                <div>
                    <p className='mb-1 sm:text-sm  md:text-xs text-sm'>Password</p>
                    <div className='flex items-center'>
                        <input type={passwordIcon ? "password" : "text"} placeholder="enter username" className='w-full p-2 outline-none bg-neutral-700 focus:bg-violet-500/30 duration-300 rounded text-sm ' />
                        <div onClick={() => setPasswordIcon(!passwordIcon)} className={"rounded p-1.5 ml-2 duration-300 cursor-pointer" + (passwordIcon ? " bg-violet-500" : " bg-neutral-200/90")}>
                            {
                                passwordIcon ? <Eye className=' scale-[0.85]' /> : <EyeOff className='text-neutral-700 scale-[0.85]' />

                            }</div>

                    </div>
                    <p className='text-right mb-4 text-xs text-white/70 mt-2 hover:text-white duration-300 cursor-pointer'> forgot password ?</p>
                </div>
                <button className=' w-full px-12 md:text-xs py-2 mb-4 text-neutral-700 bg-stone-50 rounded font-semibold hover:bg-stone-200 duration-300'>
                    Sign in with google
                </button>
                <button className=' w-full px-12 py-2  md:text-xs bg-violet-500 text-white rounded font-semibold hover:bg-violet-600 duration-300'>
                    Log in
                </button>
                <p className='text-center text-neutral-50/60 duration-[0.3s] cursor-pointer hover:text-neutral-50 text-xs mt-3 mb-1 '>Don't have an Account? Sign Up </p>
            </motion.form>
        </div>
    )
}
