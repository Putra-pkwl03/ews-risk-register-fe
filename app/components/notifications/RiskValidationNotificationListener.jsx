import { useEffect, useState, useRef } from "react";
import echo from "../../utils/echo";

export default function RiskValidationNotificationListener({
  onCountUpdate,
  resetAt,
}) {
  const [notifications, setNotifications] = useState([]);
  const isSubscribed = useRef(false);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "default" : "default";
  const localStorageKey = `notif-validation-${userId}`;

  useEffect(() => {
    const saved = localStorage.getItem(localStorageKey);
    if (saved) {
      setNotifications(JSON.parse(saved));
    }
  }, [localStorageKey]);

  useEffect(() => {
    if (!userId) return;
    if (!echo || !echo.channel || isSubscribed.current) return;

    const channel = echo.channel("risk-validation");
    if (!channel || typeof channel.listen !== "function") return;

    const handler = (notification) => {
      setNotifications((prev) => {
        if (prev.some((n) => n.id === notification.id)) return prev;
        const updated = [notification, ...prev];
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

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(notifications));
    if (onCountUpdate) onCountUpdate(notifications.length);
  }, [notifications, onCountUpdate, localStorageKey]);


  useEffect(() => {
    setNotifications([]);
    localStorage.removeItem(localStorageKey);
    if (onCountUpdate) onCountUpdate(0);
  }, [resetAt, onCountUpdate, localStorageKey]);

  return null;
}
