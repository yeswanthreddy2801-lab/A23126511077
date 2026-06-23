import { useState, useEffect } from "react";
import { Box, Stack, Typography, CircularProgress, Alert } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { NotificationCard } from "../components/NotificationCard";
import { NotificationFilter } from "../components/NotificationFilter";
import { fetchNotifications } from "../api/notifications";
import Logger from "logging-middleware";

const priorityWeights = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

export function PriorityInboxPage() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPriorityNotifications = async () => {
      try {
        setLoading(true);
        // Fetch all notifications without pagination to compute priority
        Logger.info("Loading Priority Notifications");
        const data = await fetchNotifications();
        
        let filteredData = data || [];
        
        if (filter && filter !== "All") {
          filteredData = filteredData.filter(n => n.type === filter);
        }

        // Only process unread notifications for the priority inbox
        const unreadData = filteredData.filter(n => !n.isRead);

        // Sort by Weight (desc) then Recency (desc)
        unreadData.sort((a, b) => {
          const weightA = priorityWeights[a.type] || 0;
          const weightB = priorityWeights[b.type] || 0;
          
          if (weightA !== weightB) {
            return weightB - weightA;
          }
          
          // If weights are equal, sort by recency
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        // Slice top 10
        const top10 = unreadData.slice(0, 10);
        
        setNotifications(top10);
        Logger.info("Successfully loaded and sorted Priority Inbox", { count: top10.length });
      } catch (err) {
        setError("Failed to fetch priority notifications");
        Logger.error("Failed to load Priority Inbox", { error: err.message });
      } finally {
        setLoading(false);
      }
    };

    loadPriorityNotifications();
  }, [filter]);

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter);
      Logger.info("Priority Inbox filter changed", { filter: newFilter });
    }
  };

  const handleMarkAsRead = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", px: 2, py: 4 }}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 3 }}>
        <NotificationsIcon sx={{ fontSize: 28, color: "error.main" }} />
        <Typography variant="h5" fontWeight={700}>
          Priority Inbox
        </Typography>
      </Stack>

      <NotificationFilter value={filter} onChange={handleFilterChange} />

      {error && (
        <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && !error && notifications.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
          <Typography variant="h6">No priority notifications</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            You're all caught up on important updates!
          </Typography>
        </Box>
      )}

      {!loading && !error && notifications.length > 0 && (
        <Box sx={{ mt: 3 }}>
          {notifications.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} onMarkAsRead={handleMarkAsRead} />
          ))}
        </Box>
      )}
    </Box>
  );
}
