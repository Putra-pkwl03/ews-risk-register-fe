"use client";

import { useEffect, useState } from 'react';
import api from './api'; 

export default function useCurrentUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/me');
        setUser(res.data);
      } catch (error) {
        console.error("Gagal memuat data user", error);
      }
    };

    fetchUser();
  }, []);

  return user;
}
