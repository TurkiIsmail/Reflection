"use client"
import React from 'react'
import { Eye } from 'lucide-react'
import { EyeOff } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
    const fadeInAnimationVariants = {
        initial: { opacity: 0, x: 60 },
        animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
    };
    const [passwordIcon, setPasswordIcon] = useState(false);
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const router = useRouter();

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: form.email, password: form.password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Login failed');
            localStorage.setItem('token', data.token);
            router.push('/journals');
        } catch (err) {
            setError(err.message);
        }
    };
    return (
        <div className='flex justify-center items-center mx-8 mt-28'>
            <motion.form
                initial="initial"
                animate="animate"
                variants={fadeInAnimationVariants}
                className='w-2/3 md:w-[34%] lg:w-1/4 p-4 bg-neutral-600 rounded-lg'
                onSubmit={handleSubmit}
            >
                <h1 className='text-center font-semibold mb-8 text-lg'>Login to Reflection</h1>
                {error && <p className='text-red-400 text-center mb-2'>{error}</p>}
                <div>
                    <p className='mb-1 sm:text-sm md:text-xs text-sm'>Email</p>
                    <input name='email' value={form.email} onChange={handleChange} type='email' placeholder="Enter email" className='w-full p-2 outline-none bg-neutral-700 focus:bg-violet-500/30 duration-300 rounded text-sm mb-4' required />
                </div>
                <div>
                    <p className='mb-1 sm:text-sm md:text-xs text-sm'>Password</p>
                    <div className='flex items-center'>
                        <input name='password' value={form.password} onChange={handleChange} type={passwordIcon ? "password" : "text"} placeholder="Enter password" className='w-full p-2 outline-none bg-neutral-700 focus:bg-violet-500/30 duration-300 rounded text-sm' required />
                        <div onClick={() => setPasswordIcon(!passwordIcon)} className={"rounded p-1.5 ml-2 duration-300 cursor-pointer" + (passwordIcon ? " bg-violet-500" : " bg-neutral-200/90")}>{passwordIcon ? <Eye className='scale-[0.85]' /> : <EyeOff className='text-neutral-700 scale-[0.85]' />}</div>
                    </div>
                </div>
                <button type='submit' className='w-full mt-8 px-12 py-2 md:text-xs bg-violet-500 text-white rounded font-semibold hover:bg-violet-600 duration-300'>Log in</button>
                <Link href={'/signup'}> <p className='text-center text-neutral-50/60 duration-[0.3s] cursor-pointer hover:text-neutral-50 text-xs mt-3 mb-1'>Don&apos;t have an Account? Sign Up</p></Link>
            </motion.form>
        </div>
    );
}
