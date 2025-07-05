"use client"
import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'
import Nav from '../navbar/nav'
import Link from 'next/link';

export default function Signup() {
    const fadeInAnimationVariants = {
        initial: { opacity: 0, x: 60 },
        animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
    };
    const [passwordIcon, setPasswordIcon] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        favoriteColor: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    favoriteColor: form.favoriteColor
                })
            });
            if (!res.ok) throw new Error((await res.json()).error || 'Signup failed');
            setSuccess('Signup successful! You can now log in.');
        } catch (err) {
            setError(err.message);
        }
    }
    return (
        <>
        <Nav />
        <div className='flex justify-center items-center mx-8 mt-28'>
            <motion.form
                initial="initial"
                whileInView={"animate"}
                viewport={{ once: false }}
                variants={fadeInAnimationVariants}
                className='w-2/3 md:w-[34%] lg:w-1/4 p-4 bg-neutral-600 rounded-lg'
                onSubmit={handleSubmit}
            >
                <h1 className='text-center font-semibold mb-8 text-lg'>Sign Up for Reflection</h1>
                {error && <p className='text-red-400 text-center mb-2'>{error}</p>}
                {success && <p className='text-green-400 text-center mb-2'>{success}</p>}
                <div>
                    <p className='mb-1 sm:text-sm md:text-xs text-sm'>Name</p>
                    <input name='name' value={form.name} onChange={handleChange} type='text' placeholder="Enter your name" className='w-full p-2 outline-none bg-neutral-700 focus:bg-violet-500/30 duration-300 rounded text-sm mb-4' required />
                </div>
                <div>
                    <p className='mb-1 sm:text-sm md:text-xs text-sm'>Email</p>
                    <input name='email' value={form.email} onChange={handleChange} type='email' placeholder="Enter your email" className='w-full p-2 outline-none bg-neutral-700 focus:bg-violet-500/30 duration-300 rounded text-sm mb-4' required />
                </div>
                <div>
                    <p className='mb-1 sm:text-sm md:text-xs text-sm'>Password</p>
                    <div className='flex items-center'>
                        <input name='password' value={form.password} onChange={handleChange} type={passwordIcon ? "password" : "text"} placeholder="Enter password" className='w-full p-2 outline-none bg-neutral-700 focus:bg-violet-500/30 duration-300 rounded text-sm' required />
                        <div onClick={() => setPasswordIcon(!passwordIcon)} className={"rounded p-1.5 ml-2 duration-300 cursor-pointer" + (passwordIcon ? " bg-violet-500" : " bg-neutral-200/90")}>{passwordIcon ? <Eye className='scale-[0.85]' /> : <EyeOff className='text-neutral-700 scale-[0.85]' />}</div>
                    </div>
                </div>
                <div>
                    <p className='mb-1 sm:text-sm md:text-xs text-sm'>Confirm Password</p>
                    <input name='confirmPassword' value={form.confirmPassword} onChange={handleChange} type='password' placeholder="Confirm password" className='w-full p-2 outline-none bg-neutral-700 focus:bg-violet-500/30 duration-300 rounded text-sm mb-4' required />
                </div>
                <div>
                    <p className='mb-1 sm:text-sm md:text-xs text-sm'>Favorite Color (optional)</p>
                    <input name='favoriteColor' value={form.favoriteColor} onChange={handleChange} type='text' placeholder="e.g. Violet" className='w-full p-2 outline-none bg-neutral-700 focus:bg-violet-500/30 duration-300 rounded text-sm mb-4' />
                </div>
                <button type='submit' className='w-full px-12 py-2 md:text-xs bg-violet-500 text-white rounded font-semibold hover:bg-violet-600 duration-300'>Sign Up</button>
               <Link href={"/login"}><p className='text-center text-neutral-50/60 duration-[0.3s] cursor-pointer hover:text-neutral-50 text-xs mt-3 mb-1'>Already have an account? Log In</p></Link>
            </motion.form>
        </div></>
        
    )
}
