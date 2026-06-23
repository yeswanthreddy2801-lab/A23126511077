import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { NotificationsPage } from "./pages/NotificationsPage";
import { PriorityInboxPage } from "./pages/PriorityInboxPage";

function App() {
  return (
    <Router>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', color: '#fff' }}>
            Campus Evaluation
          </Typography>
          <Button component={Link} to="/" sx={{ color: '#fff' }}>All Notifications</Button>
          <Button component={Link} to="/priority" sx={{ color: '#fff' }}>Priority Inbox</Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2 }}>
        <Routes>
          <Route path="/" element={<NotificationsPage />} />
          <Route path="/priority" element={<PriorityInboxPage />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;