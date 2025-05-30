"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Layout from './Layout';
import api from '../lib/api'; 
import ManageUsers from '../components/manage-users/ManageUsers';
import IdentifikasiRisikoTable from "../components/IdentifikasiRisk/IdentifikasiRisk";
import AnalisisRisiko from "../components/AnalisisRisiko/AnalisisRisiko";
import FormAnalisis from '../components/AnalisisRisiko/FormAnalisis';


export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get('page');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || token === 'undefined' || token.trim() === '') {
      router.replace('/login');
    } else {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      api.get('/me')
        .then((res) => {
          setUser(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Gagal mengambil user:', err);
          router.replace('/login');
        });
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-white">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin" />
          <p className="text-gray-700 text-sm">Memuat data pengguna...</p>
        </div>
      </div>
    );
  }
  

  return (
    <Layout>
      {page === "manage-users" ? (
        <ManageUsers />
      ) : page === "identifikasi-risiko" ? (
        <IdentifikasiRisikoTable />
      ) : page === "analisis-risiko" ? (
        <AnalisisRisiko />
      ) : page === "form-analisis" ? (
        <FormAnalisis />
      ) : (
        <div className="flex items-center justify-center h-full">
          <h1 className="text-2xl font-bold text-black">
            Selamat datang di Dashboard
          </h1>
        </div>
      )}
    </Layout>
  );
}
