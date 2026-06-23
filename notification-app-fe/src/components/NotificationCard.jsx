import { Card, CardContent, Typography, Box, Badge } from "@mui/material";

export function NotificationCard({ notification, onMarkAsRead }) {
  return (
    <Card 
      variant="outlined" 
      onClick={() => {
        if (!notification.isRead && onMarkAsRead) {
          onMarkAsRead(notification.id);
        }
      }}
      sx={{ 
        mb: 2,
        cursor: !notification.isRead ? "pointer" : "default",
        bgcolor: notification.isRead ? 'background.paper' : 'action.hover',
        borderLeft: !notification.isRead ? '4px solid #1976d2' : '1px solid rgba(0, 0, 0, 0.12)',
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 2
        }
      }}
    >
      <CardContent sx={{ pb: "16px !important" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {notification.type}
            </Typography>
            <Typography variant="body1" fontWeight={notification.isRead ? 'normal' : 'bold'}>
              {notification.message}
            </Typography>
          </Box>
          {notification.date && (
            <Typography variant="caption" color="text.secondary">
              {new Date(notification.date).toLocaleDateString()}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
