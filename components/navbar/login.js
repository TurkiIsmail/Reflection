"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import UserMenu from './UserMenu';

// Dummy auth check: replace with your real auth logic
function isLoggedIn() {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
}

export default function Login() {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        setLoggedIn(isLoggedIn());
        // Listen for login/logout events (optional, for better UX)
        const handler = () => setLoggedIn(isLoggedIn());
        window.addEventListener('storage', handler);
        return () => window.removeEventListener('storage', handler);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setLoggedIn(false);
        window.location.href = '/login';
    };

    if (loggedIn) {
        return <UserMenu onLogout={handleLogout} />;
    }
    return (
        <div>
          <Link href={"/signup"}><button className=' text-white/90 hover:text-white mr-3 duration-300   sm:text-sm min-[360px]:text-xs  '>Sign In</button></Link>
          <Link href={"/login"}><button className=' text-white border duration-300 hover:bg-white hover:text-black px-4 min-[360px]:px-2 sm:text-sm min-[360px]:text-xs py-1 font-semibold  rounded-md'>Log In</button></Link>
      </div>
  );
}
