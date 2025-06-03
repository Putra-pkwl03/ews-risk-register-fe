import { useEffect, useState, useRef } from "react";
import echo from "../../utils/echo";

export default function NotificationListener({ onCountUpdate, resetAt }) {
  const [notifications, setNotifications] = useState([]);
  const isSubscribed = useRef(false);
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;


  useEffect(() => {
    if (userId) {
      const savedNotifs =
        JSON.parse(localStorage.getItem(`notif_${userId}`)) || [];
      setNotifications(savedNotifs);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    if (!echo || !echo.channel || isSubscribed.current) return;

    const channel = echo.channel("risk-analysis");
    if (!channel || typeof channel.listen !== "function") return;

    const handler = (notification) => {
      // console.log("Notification received:", notification);

      setNotifications((prev) => {
        const exists = prev.find((n) => n.id === notification.id);
        if (!exists) {
          const updated = [notification, ...prev];
          localStorage.setItem(`notif_${userId}`, JSON.stringify(updated));
          return updated;
        }
        return prev;
      });
    };

    channel.listen(".notification-menris", handler);
    isSubscribed.current = true;

    return () => {
      echo.leave("risk-analysis");
      isSubscribed.current = false;
    };
  }, [userId]);

  useEffect(() => {
    if (onCountUpdate) onCountUpdate(notifications.length);
  }, [notifications, onCountUpdate]);


  useEffect(() => {
    if (resetAt && userId) {
      setNotifications([]);
      localStorage.removeItem(`notif_${userId}`);
      if (onCountUpdate) onCountUpdate(0);
    }
  }, [resetAt, userId, onCountUpdate]);

  return null;
}
