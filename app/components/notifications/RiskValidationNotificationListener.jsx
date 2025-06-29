// import { useEffect, useState, useRef } from "react";
// import echo from "../../utils/echo";

// export default function RiskValidationNotificationListener({
//   onCountUpdate,
//   resetAt,
// }) {
//   const [notifications, setNotifications] = useState([]);
//   const [userId, setUserId] = useState(null);
//   const isSubscribed = useRef(false);

//   // Ambil userId
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const storedUserId = localStorage.getItem("userId");
//       if (storedUserId) {
//         setUserId(storedUserId);
//       } else {
//         const interval = setInterval(() => {
//           const retryUserId = localStorage.getItem("userId");
//           if (retryUserId) {
//             console.log("[NOTIF-VALIDATION] userId ditemukan setelah retry");
//             setUserId(retryUserId);
//             clearInterval(interval);
//           }
//         }, 300);
//         return () => clearInterval(interval);
//       }
//     }
//   }, []);

//   const localStorageKey = userId ? `notif-validation-${userId}` : null;

//   // Ambil dari localStorage
//   useEffect(() => {
//     if (!localStorageKey) return;
//     const saved = localStorage.getItem(localStorageKey);
//     if (saved) {
//       try {
//         const parsed = JSON.parse(saved);
//         if (Array.isArray(parsed)) {
//           setNotifications(parsed);
//         }
//       } catch (err) {
//         console.error("[NOTIF-VALIDATION] Gagal parsing localStorage:", err);
//       }
//     }
//   }, [localStorageKey]);

//   // Listener Echo
//   useEffect(() => {
//     if (!userId || !localStorageKey || !echo || isSubscribed.current) return;

//     const channel = echo.channel("risk-validation");
//     if (!channel || typeof channel.listen !== "function") return;

//     const handler = (notification) => {
//       console.log("[NOTIF-VALIDATION] Diterima:", notification);
//       setNotifications((prev) => {
//         const exists = prev.some((n) => n.id === notification.id);
//         if (exists) {
//           console.log("[NOTIF-VALIDATION] Duplikat, diabaikan:", notification.id);
//           return prev;
//         }
//         const updated = [{ ...notification, isRead: false }, ...prev];
//         localStorage.setItem(localStorageKey, JSON.stringify(updated));
//         return updated;
//       });
//     };

//     channel.listen(".notification-validasi-risk", handler);
//     isSubscribed.current = true;

//     return () => {
//       echo.leave("risk-validation");
//       isSubscribed.current = false;
//     };
//   }, [userId, localStorageKey]);

//   // Simpan dan hitung badge
//   useEffect(() => {
//     if (!localStorageKey) return;
//     localStorage.setItem(localStorageKey, JSON.stringify(notifications));
//     if (onCountUpdate) {
//       const unreadCount = notifications.filter((n) => !n.isRead).length;
//       onCountUpdate(unreadCount);
//     }
//   }, [notifications, onCountUpdate, localStorageKey]);

//   // Reset notif (mark as read)
//   useEffect(() => {
//     if (!resetAt || !localStorageKey) return;
//     setNotifications((prev) => {
//       const updated = prev.map((n) => ({ ...n, isRead: true }));
//       localStorage.setItem(localStorageKey, JSON.stringify(updated));
//       if (onCountUpdate) onCountUpdate(0);
//       return updated;
//     });
//   }, [resetAt, onCountUpdate, localStorageKey]);

//   return null;
// }




import { useEffect, useState, useRef } from "react";
import echo from "../../utils/echo";

export default function RiskValidationNotificationListener({
  onCountUpdate,
  resetAt,
}) {
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const isSubscribed = useRef(false);

  // Ambil userId dan role dari localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      const storedRole = localStorage.getItem("role");

      if (storedUserId) setUserId(storedUserId);
      if (storedRole) setRole(storedRole);

      // Retry jika belum ada
      if (!storedUserId || !storedRole) {
        const interval = setInterval(() => {
          const retryUserId = localStorage.getItem("userId");
          const retryRole = localStorage.getItem("role");

          if (retryUserId && retryRole) {
            console.log(
              "[NOTIF-VALIDATION] userId & role ditemukan setelah retry"
            );
            setUserId(retryUserId);
            setRole(retryRole);
            clearInterval(interval);
          }
        }, 300);
        return () => clearInterval(interval);
      }
    }
  }, []);

  const localStorageKey = userId ? `notif-validation-${userId}` : null;

  // Ambil data notifikasi dari localStorage
  useEffect(() => {
    if (!localStorageKey) return;
    const saved = localStorage.getItem(localStorageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setNotifications(parsed);
        }
      } catch (err) {
        console.error("[NOTIF-VALIDATION] Gagal parsing localStorage:", err);
      }
    }
  }, [localStorageKey]);

  // Echo listener
  useEffect(() => {
    if (!userId || !localStorageKey || !echo || isSubscribed.current) return;

    const channel = echo.channel("risk-validation");
    if (!channel || typeof channel.listen !== "function") return;

    const handler = (notification) => {
      console.log("[NOTIF-VALIDATION] Diterima:", notification);

      // Filter berdasarkan role
      if (notification.is_approved === false && role === "koordinator_mutu") {
        console.log(
          "[NOTIF-VALIDATION] Ditolak ? diabaikan oleh koordinator_mutu"
        );
        return;
      }

      setNotifications((prev) => {
        const exists = prev.some((n) => n.id === notification.id);
        if (exists) {
          console.log(
            "[NOTIF-VALIDATION] Duplikat, diabaikan:",
            notification.id
          );
          return prev;
        }
        const updated = [{ ...notification, isRead: false }, ...prev];
        localStorage.setItem(localStorageKey, JSON.stringify(updated));
        return updated;
      });
    };

    channel.listen(".notification-validasi-risk", handler);
    isSubscribed.current = true;

    return () => {
      echo.leave("risk-validation");
      isSubscribed.current = false;
    };
  }, [userId, localStorageKey, role]);

  // Simpan notifikasi ke localStorage dan update badge
  useEffect(() => {
    if (!localStorageKey) return;
    localStorage.setItem(localStorageKey, JSON.stringify(notifications));
    if (onCountUpdate) {
      const unreadCount = notifications.filter((n) => !n.isRead).length;
      onCountUpdate(unreadCount);
    }
  }, [notifications, onCountUpdate, localStorageKey]);

  // Reset notif (mark all as read)
  useEffect(() => {
    if (!resetAt || !localStorageKey) return;
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, isRead: true }));
      localStorage.setItem(localStorageKey, JSON.stringify(updated));
      if (onCountUpdate) onCountUpdate(0);
      return updated;
    });
  }, [resetAt, onCountUpdate, localStorageKey]);

  return null;
}
