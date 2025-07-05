"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

function isLoggedIn() {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
}

export default function NavLinks() {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        setLoggedIn(isLoggedIn());
        const handler = () => setLoggedIn(isLoggedIn());
        window.addEventListener('storage', handler);
        return () => window.removeEventListener('storage', handler);
    }, []);

    return (
      <div className='justify-between text-md font-normal items-center min-[360px]:hidden md:flex sm:w-1/3 md:w-1/4 text-white/70'>
          {loggedIn && (
              <>
                  <Link href={'/journals'}><p className='hover:text-white duration-300 sm:text-sm min-[360px]:text-xs'>Journals</p></Link>
                  <Link href={'/dashboard'}><p className='hover:text-white duration-300 sm:text-sm min-[360px]:text-xs'>Dashboard</p></Link>
              </>
          )}
      </div>
  );
}
