"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Layout from './Layout';
import api from '../lib/api';
import ManageUsers from '../components/manage-users/ManageUsers';

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get('page');
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

  if (loading) return null;

  return (
    <Layout>
      {page === 'manage-users' ? (
        <ManageUsers />
      ) : (
        <h2 className="text-2xl font-semibold">Selamat datang di Dashboard</h2>
      )}
    </Layout>
  );
}
