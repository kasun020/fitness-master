import {
  Cancel,
  CheckCircle,
  FitnessCenter,
  PersonAdd,
  Refresh,
  Search,
  Visibility,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../../contexts/GlobalContext";
import "./adminDashTable.css";

export const AdminDashTable = ({ view = "approved" }) => {
  const { getAll, getRejected, updateStatus, users } = useGlobalContext();

  const [adminNotes, setAdminNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [actionType, setActionType] = useState("");

  useEffect(() => {
    if (view === "rejected") {
      getRejected();
    } else {
      getAll();
    }
  }, [view, getAll, getRejected]);

  useEffect(() => {
    if (users) {
      const filtered = users.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.scheduleType?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [users, searchQuery]);

  const onSetStatus = async (id, status) => {
    await updateStatus(id, status, adminNotes);
    setAdminNotes("");
    if (view === "rejected") {
      await getRejected();
    } else {
      await getAll();
    }
    setOpenDialog(false);
  };

  const handleRefresh = () => {
    setSearchQuery("");
    view === "rejected" ? getRejected() : getAll();
  };

  const handleOpenDialog = (user, action) => {
    setSelectedUser(user);
    setActionType(action);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setAdminNotes("");
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <div className="admin-dash-table-container">
      <Box className="table-header">
        <TextField
          placeholder="Search by name, email, or schedule type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          className="search-field"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <Tooltip title="Refresh data">
          <Button
            variant="contained"
            onClick={handleRefresh}
            startIcon={<Refresh />}
            className="refresh-btn"
          >
            Refresh
          </Button>
        </Tooltip>
      </Box>

      {filteredUsers?.length === 0 ? (
        <Box className="empty-state">
          <PersonAdd sx={{ fontSize: 60, color: "#bdbdbd", mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            No users found
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {searchQuery
              ? "Try adjusting your search query"
              : "Users will appear here once they register"}
          </Typography>
        </Box>
      ) : (
        <div className="table-wrapper">
          <table className="schedule-table">
            <thead>
              <tr>
                <th>User Info</th>
                <th>Schedule Type</th>
                <th>Physical Details</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={index}>
                  <td>
                    <Box className="user-info">
                      <Avatar className="user-avatar">
                        {user.name?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <div className="user-name">{user.name}</div>
                        <div className="user-email">{user.email}</div>
                      </Box>
                    </Box>
                  </td>
                  <td>
                    <Chip
                      label={user.scheduleType}
                      size="small"
                      color="primary"
                      variant="outlined"
                      className="schedule-chip"
                    />
                  </td>
                  <td>
                    <div className="physical-details">
                      <div>Age: {user.age} years</div>
                      <div>Gender: {user.gender}</div>
                      <div>Weight: {user.weight} kg</div>
                    </div>
                  </td>
                  <td>
                    <Tooltip title="View payment slip">
                      <Chip
                        icon={<Visibility />}
                        label={user.paymentSlip?.name || "N/A"}
                        size="small"
                        className="payment-chip"
                      />
                    </Tooltip>
                  </td>
                  <td>
                    <Chip
                      label={user.status}
                      color={getStatusColor(user.status)}
                      size="small"
                      className="status-chip"
                    />
                  </td>
                  <td>
                    <Box className="action-buttons">
                      <Tooltip title="Assign fitness plans">
                        <Button
                          component={Link}
                          to={`/createworkout/${user._id}`}
                          variant="contained"
                          size="small"
                          startIcon={<FitnessCenter />}
                          className="assign-btn"
                        >
                          Assign Plans
                        </Button>
                      </Tooltip>

                      {view === "rejected" ? (
                        <Tooltip title="Approve user">
                          <Button
                            variant="outlined"
                            size="small"
                            color="success"
                            startIcon={<CheckCircle />}
                            onClick={() => handleOpenDialog(user, "approve")}
                            className="action-btn"
                          >
                            Approve
                          </Button>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Reject user">
                          <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            startIcon={<Cancel />}
                            onClick={() => handleOpenDialog(user, "reject")}
                            className="action-btn"
                          >
                            Reject
                          </Button>
                        </Tooltip>
                      )}
                    </Box>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {actionType === "approve" ? "Approve User" : "Reject User"}
        </DialogTitle>
        <DialogContent>
          <Alert
            severity={actionType === "approve" ? "success" : "warning"}
            sx={{ mb: 2 }}
          >
            You are about to {actionType} {selectedUser?.name}
          </Alert>
          <TextField
            label="Admin Notes (Optional)"
            placeholder="Add any notes or reasons for this action..."
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            fullWidth
            multiline
            rows={3}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={() =>
              onSetStatus(
                selectedUser._id,
                actionType === "approve" ? "approved" : "rejected"
              )
            }
            variant="contained"
            color={actionType === "approve" ? "success" : "error"}
          >
            Confirm {actionType === "approve" ? "Approval" : "Rejection"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
