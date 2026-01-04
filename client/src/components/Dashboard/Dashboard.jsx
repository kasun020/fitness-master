import {
  Cancel,
  CheckCircle,
  FitnessCenter,
  PendingActions,
  People,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { AdminDashTable } from "../tables/AdminDashTable.jsx";
import "./Dashboard.css";

function Dashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const { users, getAll } = useGlobalContext();
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
    pending: 0,
  });

  useEffect(() => {
    getAll();
  }, [getAll]);

  useEffect(() => {
    if (users) {
      const approved = users.filter((u) => u.status === "approved").length;
      const rejected = users.filter((u) => u.status === "rejected").length;
      const pending = users.filter((u) => u.status === "pending").length;
      setStats({
        total: users.length,
        approved,
        rejected,
        pending,
      });
    }
  }, [users]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.total,
      icon: <People sx={{ fontSize: 40 }} />,
      color: "#3f51b5",
      bgColor: "#e8eaf6",
    },
    {
      title: "Approved",
      value: stats.approved,
      icon: <CheckCircle sx={{ fontSize: 40 }} />,
      color: "#4caf50",
      bgColor: "#e8f5e9",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: <PendingActions sx={{ fontSize: 40 }} />,
      color: "#ff9800",
      bgColor: "#fff3e0",
    },
    {
      title: "Rejected",
      value: stats.rejected,
      icon: <Cancel sx={{ fontSize: 40 }} />,
      color: "#f44336",
      bgColor: "#ffebee",
    },
  ];

  return (
    <div className="dashboard-container">
      <Box className="dashboard-header">
        <Typography variant="h4" className="dashboard-title">
          <FitnessCenter sx={{ mr: 1, fontSize: 35 }} />
          Admin Dashboard
        </Typography>
        <Typography variant="body2" className="dashboard-subtitle">
          Manage user registrations and fitness plans
        </Typography>
      </Box>

      <Grid container spacing={3} className="stats-grid">
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card className="stat-card" elevation={3}>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      {card.title}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {card.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: card.bgColor,
                      color: card.color,
                      borderRadius: "12px",
                      padding: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper className="table-container" elevation={3}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          className="dashboard-tabs"
        >
          <Tab label="Approved Users" />
          <Tab label="Rejected Users" />
        </Tabs>

        <Box className="tab-content">
          {activeTab === 0 && <AdminDashTable view="approved" />}
          {activeTab === 1 && <AdminDashTable view="rejected" />}
        </Box>
      </Paper>
    </div>
  );
}

export default Dashboard;
