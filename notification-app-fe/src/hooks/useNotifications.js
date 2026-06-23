import { useState, useEffect } from "react";
import { fetchNotifications } from "../api/notifications";

export function useNotifications(page = 1, filter = "All") {
  const [notifications, setNotifications] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const data = await fetchNotifications({
          page,
          limit: 10,
          notification_type: filter
        });
        
      
        let processedData = data || [];
        if (processedData.length > 0 && processedData[0].id) {
            if (filter && filter !== "All") {
              processedData = processedData.filter(n => n.type === filter);
            }
            setTotal(processedData.length > 10 ? processedData.length : 50);
            const start = (page - 1) * 10;
            processedData = processedData.slice(start, start + 10);
        } else {
            setTotal(data.total || 0);
        }

        setNotifications(processedData);
      } catch (err) {
        setError("Failed to fetch notifications");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [page, filter]);

  const totalPages = Math.ceil(total / 10) || 1;

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  return {
    notifications,
    total,
    totalPages,
    loading,
    error,
    markAsRead,
  };
}