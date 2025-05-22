"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from './Layout';
import api from '../lib/api';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || token === 'undefined' || token.trim() === '') {
      router.replace('/login');
    } else {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setLoading(false);
    }
  }, [router]);

  if (loading) return null; // atau spinner

  return (
    <Layout>
      <h2 className="text-2xl font-semibold">Selamat datang di Dashboard</h2>
    </Layout>
  );
}
