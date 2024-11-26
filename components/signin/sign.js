"use client"
import React from 'react'
import { motion } from 'framer-motion';
import { useState } from 'react'
export default function signin() {

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
    return (

        <div className=' flex justify-center items-center minz-[320px]:mx-4 min-[362px]:mx-8 mt-16'>
            <motion.form
                initial="initial"  // Specify the initial state
                whileInView={"animate"}
                viewport={{ once: true }}
                // This should be whileHover, not hover
                // Specify the animate state
                variants={fadeInAnimationVariants}
                className='min-[360px]:w-full sm:w-1/2 md:w-[34%] lg:w-1/4  p-4   bg-neutral-600 rounded-lg'>
                <h1 className='text-center font-semibold mb-8 text-lg'>Sign In to Reflection</h1>
                <div>
                    <p className='mb-1 text-sm'>Username</p>
                    <input type='text' placeholder="Enter username" className='w-full p-2 outline-none bg-neutral-700 focus:bg-violet-500/30 duration-300 rounded text-sm mb-4' />
                </div>
                <div>
                    <p className='mb-1 text-sm'>Email</p>
                    <input type='Email' placeholder="Example@gmail.com" className='w-full p-2 outline-none bg-neutral-700 focus:bg-violet-500/30 duration-300 rounded text-sm mb-4' />
                </div>
                <div>
                    <p className='mb-1 text-sm'>Password</p>
                    <div className='flex items-center'>
                        <input type="password" placeholder="Enter password" className='w-full p-2 outline-none bg-neutral-700 focus:bg-violet-500/30 duration-300 rounded text-sm mb-4 ' />

                    </div>
                </div>
                <div>
                    <p className='mb-1 text-sm'>Confirm Password</p>
                    <div className='flex items-center'>
                        <input type="password" placeholder="Confirm password" className='w-full p-2 outline-none bg-neutral-700 focus:bg-violet-500/30 duration-300 rounded text-sm mb-4  ' />

                    </div>
                </div>

                <button className=' w-full px-12 py-2 bg-violet-500 text-white rounded font-semibold hover:bg-violet-600 duration-300'>
                    Sign in
                </button>
            </motion.form>
        </div>
    )
}
