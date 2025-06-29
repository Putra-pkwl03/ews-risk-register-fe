// components/ReviewHandlingNotificationListener.js
import { useEffect, useState, useRef } from "react";
import echo from "../../utils/echo";

export default function ReviewHandlingNotificationListener({ onCountUpdate, resetAt }) {
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);
  const isSubscribed = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("userId");
      if (stored) {
        setUserId(stored);
      } else {
        const retry = setInterval(() => {
          const retryUserId = localStorage.getItem("userId");
          if (retryUserId) {
            console.log("[NOTIF-REVIEW] userId ditemukan setelah retry");
            setUserId(retryUserId);
            clearInterval(retry);
          }
        }, 300);
        return () => clearInterval(retry);
      }
    }
  }, []);

  const localStorageKey = userId ? `notif_review_${userId}` : null;

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
        console.error("[NOTIF-REVIEW] Gagal parsing localStorage:", err);
      }
    }
  }, [localStorageKey]);

  useEffect(() => {
    if (!userId || !localStorageKey || !echo || isSubscribed.current) return;

    const channel = echo.channel("review-handling");
    if (!channel || typeof channel.listen !== "function") return;

    const handler = (notification) => {
      console.log("[NOTIF-REVIEW] Diterima:", notification);
      setNotifications((prev) => {
        const exists = prev.some((n) => n.id === notification.id);
        if (exists) return prev;
        const updated = [{ ...notification, isRead: false }, ...prev];
        localStorage.setItem(localStorageKey, JSON.stringify(updated));
        return updated;
      });
    };

    channel.listen(".notification-review-handling", handler);
    isSubscribed.current = true;

    return () => {
      echo.leave("review-handling");
      isSubscribed.current = false;
    };
  }, [userId, localStorageKey]);

  useEffect(() => {
    if (!localStorageKey) return;
    localStorage.setItem(localStorageKey, JSON.stringify(notifications));
    if (onCountUpdate) {
      const unreadCount = notifications.filter((n) => !n.isRead).length;
      onCountUpdate(unreadCount);
    }
  }, [notifications, onCountUpdate, localStorageKey]);

  useEffect(() => {
    if (!localStorageKey || !resetAt) return;

    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, isRead: true }));
      localStorage.setItem(localStorageKey, JSON.stringify(updated));
      if (onCountUpdate) onCountUpdate(0);
      return updated;
    });
  }, [resetAt, onCountUpdate, localStorageKey]);

  return null;
}
