import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EmailIcon from "@mui/icons-material/Email";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PersonIcon from "@mui/icons-material/Person";
import {
  Avatar,
  Box,
  Checkbox,
  Chip,
  CircularProgress,
  Collapse,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useMemo, useState } from "react";

/**
 * Interface for user data structure
 */
export interface TeamMember {
  userId: string;
  label: string;
  email?: string;
  role: string;
}

/**
 * Props interface for TeamMemberSelector component
 */
export interface TeamMemberSelectorProps {
  /**
   * Array of all available users to select from
   */
  users: TeamMember[];

  /**
   * Array of currently selected member IDs
   */
  selectedMembers: string[];

  /**
   * Callback function when selection changes
   * @param memberIds - Array of selected member IDs
   */
  onSelectionChange: (memberIds: string[]) => void;

  /**
   * ID of the team leader (will be disabled and highlighted)
   */
  teamLeaderId?: string;

  /**
   * Whether the component is in loading state
   * @default false
   */
  isLoading?: boolean;

  /**
   * Custom title for the component
   * @default "Select Team Members"
   */
  title?: string;

  /**
   * Custom subtitle/description
   * @default "Choose team members by role or select individuals. Team leader is automatically included."
   */
  subtitle?: string;

  /**
   * Initial expanded state for roles
   * @default { "Super Admin": true, "Admin": true, "Manager": true }
   */
  initialExpandedRoles?: Record<string, boolean>;

  /**
   * Custom role sorting order
   * If not provided, uses default order: Super Admin, Admin, Manager, User
   */
  roleSortOrder?: string[];

  /**
   * Disable the entire component
   * @default false
   */
  disabled?: boolean;

  /**
   * Show empty state when no users available
   * @default true
   */
  showEmptyState?: boolean;

  /**
   * Custom empty state message
   */
  emptyStateMessage?: string;
}

/**
 * TeamMemberSelector Component
 *
 * A professional, reusable component for selecting team members from a list of users.
 * Features:
 * - Grouped by role with expand/collapse functionality
 * - Visual indicators for selection state
 * - Team leader highlighting and auto-inclusion
 * - Avatar display with user initials
 * - Responsive design with light/dark mode support
 * - Accessible with proper ARIA labels
 *
 * @example
 * ```tsx
 * <TeamMemberSelector
 *   users={users}
 *   selectedMembers={selectedMembers}
 *   onSelectionChange={(memberIds) => setSelectedMembers(memberIds)}
 *   teamLeaderId="user-123"
 *   isLoading={false}
 * />
 * ```
 */
const TeamMemberSelector: React.FC<TeamMemberSelectorProps> = ({
  users,
  selectedMembers,
  onSelectionChange,
  teamLeaderId,
  isLoading = false,
  title = "Select Team Members",
  subtitle = "Choose team members by role or select individuals. Team leader is automatically included.",
  initialExpandedRoles = {
    "Super Admin": true,
    Admin: true,
    Manager: true,
  },
  roleSortOrder = ["Super Admin", "Admin", "Manager", "User"],
  disabled = false,
  showEmptyState = true,
  emptyStateMessage = "No users available for selection.",
}) => {
  const theme = useTheme();
  const [expandedRoles, setExpandedRoles] =
    useState<Record<string, boolean>>(initialExpandedRoles);

  /**
   * Group users by their role
   */
  const usersByRole = useMemo(() => {
    return users.reduce(
      (acc: Record<string, TeamMember[]>, user: TeamMember) => {
        const role = user.role || "User";
        if (!acc[role]) {
          acc[role] = [];
        }
        acc[role].push(user);
        return acc;
      },
      {}
    );
  }, [users]);

  /**
   * Get sorted roles based on provided order or default hierarchy
   */
  const sortedRoles = useMemo(() => {
    return Object.keys(usersByRole).sort((a, b) => {
      const indexA = roleSortOrder.indexOf(a);
      const indexB = roleSortOrder.indexOf(b);

      // If both roles are in the sort order, sort by index
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }

      // If only one role is in the sort order, prioritize it
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;

      // If neither role is in the sort order, sort alphabetically
      return a.localeCompare(b);
    });
  }, [usersByRole, roleSortOrder]);

  /**
   * Handle role checkbox change (select/deselect all users in a role)
   */
  const handleRoleToggle = (role: string, checked: boolean) => {
    const usersInRole = usersByRole[role];
    const roleUserIds = usersInRole.map((user) => user.userId);
    let updatedMembers = [...selectedMembers];

    if (checked) {
      // Add all users with this role
      roleUserIds.forEach((userId) => {
        if (!updatedMembers.includes(userId)) {
          updatedMembers.push(userId);
        }
      });
    } else {
      // Remove all users with this role (except team leader)
      updatedMembers = updatedMembers.filter(
        (memberId) =>
          !roleUserIds.includes(memberId) || memberId === teamLeaderId
      );
    }

    onSelectionChange(updatedMembers);
  };

  /**
   * Handle individual user checkbox change
   */
  const handleUserToggle = (userId: string, checked: boolean) => {
    const updatedMembers = [...selectedMembers];

    if (checked) {
      if (!updatedMembers.includes(userId)) {
        updatedMembers.push(userId);
      }
    } else {
      const index = updatedMembers.indexOf(userId);
      if (index > -1) {
        updatedMembers.splice(index, 1);
      }
    }

    onSelectionChange(updatedMembers);
  };

  /**
   * Toggle role expansion state
   */
  const toggleRoleExpansion = (role: string) => {
    setExpandedRoles((prev) => ({
      ...prev,
      [role]: !prev[role],
    }));
  };

  /**
   * Generate avatar content from user label
   */
  const getAvatarContent = (label: string): string => {
    if (!label) return "U";
    return label
      .split(" ")
      .map((n) => n[0]?.toUpperCase())
      .join("")
      .substring(0, 2);
  };

  /**
   * Render empty state
   */
  if (showEmptyState && sortedRoles.length === 0 && !isLoading) {
    return (
      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            bgcolor: theme.palette.mode === "light" ? "grey.50" : "grey.900",
            px: 3,
            py: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="h6"
            color="text.primary"
            sx={{
              fontWeight: 600,
              fontSize: "1rem",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <GroupAddIcon fontSize="small" />
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            textAlign: "center",
            py: 6,
            color: "text.secondary",
          }}
        >
          <GroupAddIcon sx={{ fontSize: 48, opacity: 0.3, mb: 2 }} />
          <Typography variant="body2">{emptyStateMessage}</Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
        opacity: disabled ? 0.6 : 1,
        pointerEvents: disabled ? "none" : "auto",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          bgcolor: theme.palette.mode === "light" ? "grey.50" : "grey.900",
          px: 3,
          py: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="h6"
          color="text.primary"
          sx={{
            fontWeight: 600,
            fontSize: "1rem",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <GroupAddIcon fontSize="small" />
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      {/* Content Section */}
      <Box sx={{ p: 3 }}>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 6,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <FormControl component="fieldset" fullWidth>
            {sortedRoles.map((role, index) => {
              const usersInRole = usersByRole[role];
              const allUsersInRoleSelected = usersInRole.every((user) =>
                selectedMembers.includes(user.userId)
              );
              const someUsersInRoleSelected = usersInRole.some((user) =>
                selectedMembers.includes(user.userId)
              );
              const selectedCount = usersInRole.filter((user) =>
                selectedMembers.includes(user.userId)
              ).length;

              return (
                <Box key={role}>
                  {/* Divider between roles */}
                  {index > 0 && <Divider sx={{ my: 2 }} />}

                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor:
                        theme.palette.mode === "light"
                          ? "background.paper"
                          : "grey.900",
                      border: "1px solid",
                      borderColor: someUsersInRoleSelected
                        ? "primary.main"
                        : "divider",
                      borderRadius: 1.5,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: "primary.light",
                        boxShadow:
                          theme.palette.mode === "light"
                            ? "0 2px 8px rgba(0,0,0,0.05)"
                            : "0 2px 8px rgba(0,0,0,0.3)",
                      },
                    }}
                  >
                    {/* Role Header */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: 2,
                        py: 1.5,
                        bgcolor:
                          theme.palette.mode === "light"
                            ? someUsersInRoleSelected
                              ? "primary.50"
                              : "grey.50"
                            : someUsersInRoleSelected
                            ? "primary.dark"
                            : "grey.800",
                        borderRadius: expandedRoles[role]
                          ? "6px 6px 0 0"
                          : "6px",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flex: 1,
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={allUsersInRoleSelected}
                              indeterminate={
                                someUsersInRoleSelected &&
                                !allUsersInRoleSelected
                              }
                              onChange={(e) =>
                                handleRoleToggle(role, e.target.checked)
                              }
                              sx={{
                                color: someUsersInRoleSelected
                                  ? "primary.main"
                                  : "default",
                              }}
                            />
                          }
                          label={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Typography
                                variant="subtitle1"
                                color="text.primary"
                                sx={{
                                  fontWeight: 600,
                                  fontSize: "0.95rem",
                                }}
                              >
                                {role}
                              </Typography>
                              <Chip
                                label={`${usersInRole.length} ${
                                  usersInRole.length === 1 ? "user" : "users"
                                }`}
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: "0.7rem",
                                  fontWeight: 500,
                                  bgcolor:
                                    theme.palette.mode === "light"
                                      ? "grey.200"
                                      : "grey.700",
                                }}
                              />
                              {someUsersInRoleSelected && (
                                <Chip
                                  icon={<CheckCircleIcon />}
                                  label={`${selectedCount} selected`}
                                  size="small"
                                  color={
                                    allUsersInRoleSelected
                                      ? "success"
                                      : "warning"
                                  }
                                  sx={{
                                    height: 20,
                                    fontSize: "0.7rem",
                                    fontWeight: 600,
                                    "& .MuiChip-icon": {
                                      fontSize: "0.9rem",
                                    },
                                  }}
                                />
                              )}
                            </Box>
                          }
                          sx={{ mb: 0, flex: 1 }}
                        />
                      </Box>

                      {/* Expand/Collapse Button */}
                      <IconButton
                        onClick={() => toggleRoleExpansion(role)}
                        size="small"
                        sx={{
                          ml: 1,
                          transition: "transform 0.2s ease",
                          "&:hover": {
                            bgcolor: "action.hover",
                          },
                        }}
                        aria-label={
                          expandedRoles[role]
                            ? `Collapse ${role} user list`
                            : `Expand ${role} user list`
                        }
                      >
                        {expandedRoles[role] ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </IconButton>
                    </Box>

                    {/* Collapsible Individual Users */}
                    <Collapse
                      in={expandedRoles[role]}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box
                        sx={{
                          px: 2,
                          py: 1,
                          bgcolor:
                            theme.palette.mode === "light"
                              ? "background.paper"
                              : "grey.900",
                        }}
                      >
                        <FormGroup>
                          {usersInRole.map((user, userIndex) => {
                            const isTeamLeader = user.userId === teamLeaderId;
                            const isSelected = selectedMembers.includes(
                              user.userId
                            );

                            return (
                              <Box
                                key={user.userId}
                                sx={{
                                  borderBottom:
                                    userIndex < usersInRole.length - 1
                                      ? "1px solid"
                                      : "none",
                                  borderColor: "divider",
                                }}
                              >
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={isSelected}
                                      onChange={(e) => {
                                        // Prevent unchecking the team leader
                                        if (isTeamLeader && !e.target.checked) {
                                          return;
                                        }
                                        handleUserToggle(
                                          user.userId,
                                          e.target.checked
                                        );
                                      }}
                                      disabled={isTeamLeader}
                                      sx={{
                                        color: isSelected
                                          ? "primary.main"
                                          : "default",
                                      }}
                                    />
                                  }
                                  label={
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.5,
                                        py: 1,
                                      }}
                                    >
                                      {/* User Avatar */}
                                      <Avatar
                                        sx={{
                                          width: 36,
                                          height: 36,
                                          bgcolor: isTeamLeader
                                            ? "primary.main"
                                            : isSelected
                                            ? "success.main"
                                            : "grey.400",
                                          fontSize: "0.9rem",
                                          fontWeight: 600,
                                        }}
                                      >
                                        {getAvatarContent(user.label)}
                                      </Avatar>

                                      {/* User Info */}
                                      <Box sx={{ flex: 1 }}>
                                        <Box
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                          }}
                                        >
                                          <Typography
                                            variant="body2"
                                            color="text.primary"
                                            sx={{
                                              fontWeight: 500,
                                              fontSize: "0.9rem",
                                            }}
                                          >
                                            {user.label}
                                          </Typography>
                                          {isTeamLeader && (
                                            <Chip
                                              icon={<PersonIcon />}
                                              label="Team Leader"
                                              size="small"
                                              color="primary"
                                              sx={{
                                                height: 20,
                                                fontSize: "0.65rem",
                                                fontWeight: 600,
                                                "& .MuiChip-icon": {
                                                  fontSize: "0.85rem",
                                                },
                                              }}
                                            />
                                          )}
                                        </Box>
                                        {user.email && (
                                          <Box
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                              gap: 0.5,
                                              mt: 0.25,
                                            }}
                                          >
                                            <EmailIcon
                                              sx={{
                                                fontSize: "0.85rem",
                                                color: "text.secondary",
                                              }}
                                            />
                                            <Typography
                                              variant="caption"
                                              color="text.secondary"
                                              sx={{
                                                fontSize: "0.75rem",
                                              }}
                                            >
                                              {user.email}
                                            </Typography>
                                          </Box>
                                        )}
                                      </Box>
                                    </Box>
                                  }
                                  sx={{
                                    width: "100%",
                                    m: 0,
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: 1,
                                    transition: "all 0.2s ease",
                                    "&:hover": {
                                      bgcolor:
                                        theme.palette.mode === "light"
                                          ? "grey.50"
                                          : "grey.800",
                                    },
                                  }}
                                />
                              </Box>
                            );
                          })}
                        </FormGroup>
                      </Box>
                    </Collapse>
                  </Paper>
                </Box>
              );
            })}
          </FormControl>
        )}
      </Box>
    </Paper>
  );
};

export default TeamMemberSelector;
