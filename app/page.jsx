"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && token !== 'undefined' && token.trim() !== '') {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [router]);
  

  return null; // atau tampilkan spinner jika mau
}
