import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/notionists';

// A small set of cute animal images (unsplash, open license)

export default function UserMenu({ onLogout }) {
  const [open, setOpen] = useState(false);

  const [img, setImg] = useState(null);
  const menuRef = useRef();

  useEffect(() => {
    // Use Dicebear Notionists API for random cute avatar by name
    const names = [
      'Amaya', 'Jessica', 'Aidan', 'Chase', 'Andrea', 'Caleb', 'Brooklynn', 'Eden', 'Mason',
      'Kimberly', 'Wyatt', 'Jack', 'George', 'Brian', 'Emery', 'Sadie', 'Sawyer', 'Adrian', 'Liam', 'Sara', 'Leah'
    ];
    const lightColors = [
      'c0aede', 'ffdfbf', 'ffd5dc', 'd1d4f9', 'e0e4cc', 'f1f8e9', 'fceabb', 'e0c3fc', 'f9fbe7', 'e3f2fd', 'f8bbd0', 'ffe082', 'b2dfdb', 'f0f4c3', 'fff9c4', 'ffe0b2', 'dcedc8', 'f5f5dc', 'f3e5f5', 'e1bee7'
    ];
    const randomName = names[Math.floor(Math.random() * names.length)];
    // Pick 2-4 random light colors for the background
    const shuffled = lightColors.sort(() => 0.5 - Math.random());
    const bgColors = shuffled.slice(0, Math.floor(Math.random() * 3) + 2); // 2-4 colors
    const svg = createAvatar(style, {
      seed: randomName,
      backgroundRotation: Math.floor(Math.random() * 360),
      backgroundColor: bgColors,
      backgroundType: 'solid', // ensure background is not transparent
    });
    const url = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    setImg(url);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="w-10 h-10 rounded-full border-2 border-violet-400 overflow-hidden focus:outline-none focus:ring-2 focus:ring-violet-400"
        onClick={() => setOpen(o => !o)}
        title="Account menu"
      >
        {img && (
          <img src={img} alt="Profile" width={40} height={40} className="w-full h-full object-cover" />
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-neutral-900 border border-neutral-700 rounded-xl shadow-lg z-50 py-2 animate-fade-in">
          <button
            className="w-full text-left px-4 py-2 text-white hover:bg-violet-600 rounded-xl transition"
            onClick={onLogout}
          >Logout</button>
        </div>
      )}
    </div>
  );
}
