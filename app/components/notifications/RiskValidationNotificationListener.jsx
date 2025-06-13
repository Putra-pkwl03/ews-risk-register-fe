import { useEffect, useState, useRef } from "react";
import echo from "../../utils/echo";

export default function RiskValidationNotificationListener({
  onCountUpdate,
  resetAt,
}) {
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);
  const isSubscribed = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        console.warn("[NOTIF] userId belum tersedia di localStorage");
      }
    }
  }, []);

  const localStorageKey = userId ? `notif-validation-${userId}` : null;

  // Load dari localStorage
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
        console.error("Gagal parsing localStorage notif:", err);
      }
    }
  }, [localStorageKey]);

  // Listener Echo
  useEffect(() => {
    if (!userId || !localStorageKey || !echo || isSubscribed.current) return;

    const channel = echo.channel("risk-validation");
    if (!channel || typeof channel.listen !== "function") return;

    const handler = (notification) => {
      console.log("[NOTIF] Diterima:", notification);
      setNotifications((prev) => {
        const exists = prev.some((n) => n.id === notification.id);
        if (exists) {
          console.log("[NOTIF] Sudah ada, diabaikan:", notification.id);
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
  }, [userId, localStorageKey]);

  // Simpan ke localStorage & kirim jumlah
  useEffect(() => {
    if (!localStorageKey) return;
    localStorage.setItem(localStorageKey, JSON.stringify(notifications));
    if (onCountUpdate) {
      const unreadCount = notifications.filter((n) => !n.isRead).length;
      onCountUpdate(unreadCount);
    }
  }, [notifications, onCountUpdate, localStorageKey]);

  // Reset notif: tandai semua sebagai sudah dibaca
  useEffect(() => {
    if (!localStorageKey) return;
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, isRead: true }));
      localStorage.setItem(localStorageKey, JSON.stringify(updated));
      if (onCountUpdate) onCountUpdate(0);
      return updated;
    });
  }, [resetAt, onCountUpdate, localStorageKey]);

  return null;
}
