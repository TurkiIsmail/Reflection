"use client"
import React from 'react'
import Lottie from 'lottie-react'
import Animation from '@/app/data/Animation.json'
import Link from 'next/link'
import { motion } from 'framer-motion'

function Mainsection() {
    const fadeInAnimationVariants = {
        initial: {
            opacity: 0,
            y: 60,
        },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                ease: "easeOut",
            },
        },

    };

    return (
        <motion.div
            initial="initial"
            whileInView={"animate"}
            variants={fadeInAnimationVariants}
            className='flex mx-10 justify-between w-100 flex-col sm:flex-row'>
            <div className='w-full sm:w-1/2 mt-16 sm:mt-52'>
                <p className='text-4xl font-bold'>Awareness Begins with Reflection.</p>
                <p className='text-justify mt-6'>
                    we believe in the power of <span className='text-violet-400'>self-reflection</span>. Whether you&apos;re seeking a space to jot down your daily thoughts, <span className='text-violet-400'>express your creativity</span>, or track your <span className='text-violet-400'>personal growth</span>, you&apos;ve come to the right place.
                </p>
                <Link href={'/login'}>
                    <button className='text-sm py-2 px-6 font-bold rounded-md mt-6 bg-violet-600 hover:bg-violet-700 duration-300'>Get Started</button>
                </Link>
            </div>
            <div className='w-full sm:w-1/2 mt-6 hidden sm:block'>
                {/* Only show on sm and up */}
                <Lottie animationData={Animation} loop={true} className='scale-75' />
            </div>
        </motion.div>
    )
}

export default Mainsection
