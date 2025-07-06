// "use client";

// import {
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
// } from "recharts";
// import { useMemo } from "react";
// import { ExclamationTriangleIcon } from "@heroicons/react/24/solid"; // ?? Tambahkan ini

// export default function LineDeadlineChart({ data }) {
//   const warnings = useMemo(() => {
//     const today = new Date();
//     const next7Days = new Date();
//     next7Days.setDate(today.getDate() + 7);

//     return data?.filter((item) => {
//       const date = new Date(item.date);
//       return date >= today && date <= next7Days;
//     });
//   }, [data]);

//   return (
//     <div className="relative w-full max-w-3xl mx-auto bg-white p-4 rounded-xl shadow">
//       <h2 className="text-lg font-bold text-center mb-4">
//         Jumlah Mitigasi Berdasarkan Deadline
//       </h2>
//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="date" />
//           <YAxis allowDecimals={false} />
//           <Tooltip />
//           <Legend />
//           <Line
//             type="monotone"
//             dataKey="jumlah"
//             stroke="#FF5733"
//             activeDot={{ r: 6 }}
//           />
//         </LineChart>
//       </ResponsiveContainer>

//       {/* Pemberitahuan kanan bawah */}
//       {warnings?.length > 0 && (
//         <div className="absolute bottom-2 right-4 bg-yellow-100 text-yellow-800 px-3 py-2 rounded-md text-sm shadow-md max-w-xs flex items-start gap-2">
//           <ExclamationTriangleIcon className="w-5 h-5 mt-[2px] text-red-600" />
//           <span>
//             {warnings.length} mitigasi harus diselesaikan dalam 7 hari ke depan.
//           </span>
//         </div>
//       )}
//     </div>
//   );
// }
