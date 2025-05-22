import { useState } from 'react';

export default function Sidebar({ isOpen, toggle }) {
  return (
    <div className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`}> 
      <button onClick={toggle} className="absolute top-4 right-4">?</button>
      <div className="p-4">
        <h2 className="text-lg font-semibold">Menu</h2>
        <ul className="mt-4">
          <li className="mb-2">Dashboard</li>
        </ul>
      </div>
    </div>
  );
}