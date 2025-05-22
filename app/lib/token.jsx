// "use client";

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import DashboardPage from '../page';
// import api from '../lib/api';

// export default function Dashboard() {
//   const router = useRouter();
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [checkingAuth, setCheckingAuth] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       router.push('/login');
//     } else {
//       api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       setIsAuthenticated(true);
//     }
//     setCheckingAuth(false);
//   }, [router]);

//   if (checkingAuth) return <div className="p-4">Memuat...</div>;
//   if (!isAuthenticated) return null;

//   return <DashboardPage />;
// }
