import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  InputAdornment,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useState } from "react";
import EmptyResultDataGrid from "../../EmptyResultDataGrid";

interface User {
  value: string;
  label: string;
  role: string;
  email: string;
  userId: string;
  roleId?: number;
  firstName?: string;
  lastName?: string;
}

interface UserSelectionTableProps {
  users: User[];
  selectedMembers: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  isLoading?: boolean;
  title?: string;
  subtitle?: string;
}

function UserSelectionTable({
  users,
  selectedMembers,
  onSelectionChange,
  isLoading = false,
  //   title = "Select Users",
  subtitle = "Select users from the list below",
}: UserSelectionTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filter users based on search query
  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.label?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower)
    );
  });

  // Include selected users that might not be in filtered results
  // This prevents deselection when searching
  const displayUsers = [...filteredUsers];
  const filteredUserIds = new Set(filteredUsers.map((u) => u.userId));

  // Add selected users that are not in the filtered results
  selectedMembers.forEach((selectedId) => {
    if (!filteredUserIds.has(selectedId)) {
      const selectedUser = users.find((u) => u.userId === selectedId);
      if (selectedUser) {
        displayUsers.push(selectedUser);
      }
    }
  });

  // Handle page change
  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (newPageSize: number) => {
    setRowsPerPage(newPageSize);
    setPage(0);
  };

  // Handle selection change from DataGrid
  const handleSelectionModelChange = (newSelection: any) => {
    onSelectionChange(newSelection);
  };

  // Define columns for DataGrid
  const columns: GridColDef[] = [
    {
      field: "label",
      headerName: "", // No header name
      flex: 1,
      minWidth: 250,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100%",
            py: 1.5,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              lineHeight: 1.2,
              mb: 0.125,
              color: "text.primary",
            }}
          >
            {params.row.label}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              lineHeight: 1.2,
              fontSize: "0.8rem",
            }}
          >
            {params.row.email || "—"}
          </Typography>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      {/* Title and Subtitle */}
      {subtitle && (
        <Box sx={{ mb: 3 }}>
          {/* {title && (
            <Typography variant="h6" sx={{ mb: 1 }}>
              {title}
            </Typography>
          )} */}
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      )}

      {/* Search Box */}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(0); // Reset to first page when searching
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiInputBase-input::placeholder": {
              opacity: 0.6,
              color: "inherit",
            },
          }}
        />
      </Box>

      {/* Selected Count */}
      {selectedMembers.length > 0 && (
        <Box
          sx={{
            mb: 2,
            p: 1.5,
            bgcolor: "primary.lighter",
            borderRadius: 1,
            border: "1px solid",
            borderColor: "primary.light",
          }}
        >
          <Typography
            variant="body2"
            color="primary.main"
            sx={{ fontWeight: 600 }}
          >
            {selectedMembers.length} user
            {selectedMembers.length !== 1 ? "s" : ""} selected
          </Typography>
        </Box>
      )}

      {/* DataGrid */}
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          columns={columns}
          rows={displayUsers}
          loading={isLoading}
          checkboxSelection
          disableSelectionOnClick
          getRowId={(row) => row.userId}
          selectionModel={selectedMembers}
          onSelectionModelChange={handleSelectionModelChange}
          components={{
            NoRowsOverlay: EmptyResultDataGrid,
            LoadingOverlay: LinearProgress,
          }}
          pagination
          paginationMode="client"
          rowCount={displayUsers.length}
          rowsPerPageOptions={[5, 10, 25, 50]}
          page={page}
          pageSize={rowsPerPage}
          onPageChange={handleChangePage}
          onPageSizeChange={handleChangeRowsPerPage}
          sx={{
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-row": {
              cursor: "pointer",
              borderBottom: "1px solid",
              borderColor: "divider",
              mb: 1,
              minHeight: "40px !important",
              "&:nth-of-type(odd)": {
                backgroundColor: "grey.50",
              },
              "&:nth-of-type(even)": {
                backgroundColor: "background.paper",
              },
              "&:hover": {
                backgroundColor: "action.hover",
              },
              "&.Mui-selected": {
                backgroundColor: "action.selected",
                "&:hover": {
                  backgroundColor: "action.selected",
                },
              },
            },
            "& .MuiDataGrid-selectedRowCount": {
              display: "none",
            },
            "& .MuiDataGrid-columnHeaders": {
              display: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              marginTop: "0 !important",
            },
            "& .MuiDataGrid-cell": {
              py: 0,
            },
          }}
        />
      </Box>
    </Box>
  );
}

export default UserSelectionTable;
