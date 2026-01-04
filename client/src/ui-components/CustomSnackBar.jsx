import { CheckCircle, Close, Error, Info, Warning } from "@mui/icons-material";
import { Box, IconButton, Snackbar, Typography, useTheme } from "@mui/material";
import { create } from "zustand";

const useSnackBarStore = create(() => ({
  message: "",
  severity: "success",
  open: false,
}));

export const openSnackBar = (message, severity) => {
  useSnackBarStore.setState({
    message: message,
    severity: severity,
    open: true,
  });
};

export const closeSnackBar = () => {
  useSnackBarStore.setState({
    open: false,
  });
};

export default function CustomizedSnackbar() {
  const { message, severity, open } = useSnackBarStore();
  const theme = useTheme();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    useSnackBarStore.setState({
      open: false,
    });
  };

  const getIcon = () => {
    switch (severity) {
      case "success":
        return <CheckCircle sx={{ fontSize: 20 }} />;
      case "error":
        return <Error sx={{ fontSize: 20 }} />;
      case "warning":
        return <Warning sx={{ fontSize: 20 }} />;
      case "info":
        return <Info sx={{ fontSize: 20 }} />;
      default:
        return <Info sx={{ fontSize: 20 }} />;
    }
  };

  const getColors = () => {
    switch (severity) {
      case "success":
        return {
          background: theme.palette.success.light,
          border: theme.palette.success.main,
          text: theme.palette.success.dark,
          icon: theme.palette.success.main,
        };
      case "error":
        return {
          background: theme.palette.error.light,
          border: theme.palette.error.main,
          text: theme.palette.error.dark,
          icon: theme.palette.error.main,
        };
      case "warning":
        return {
          background: theme.palette.warning.light,
          border: theme.palette.warning.main,
          text: theme.palette.warning.dark,
          icon: theme.palette.warning.main,
        };
      case "info":
        return {
          background: theme.palette.info.light,
          border: theme.palette.info.main,
          text: theme.palette.info.dark,
          icon: theme.palette.info.main,
        };
      default:
        return {
          background: theme.palette.grey[100],
          border: theme.palette.grey[400],
          text: theme.palette.grey[800],
          icon: theme.palette.grey[600],
        };
    }
  };

  const colors = getColors();

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      sx={{
        "& .MuiSnackbarContent-root": {
          padding: 0,
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          backgroundColor: colors.background,
          border: `1px solid ${colors.border}`,
          borderRadius: "8px",
          padding: theme.spacing(1.5, 2),
          minWidth: 320,
          maxWidth: 480,
          boxShadow: theme.shadows[4],
          backdropFilter: "blur(8px)",
        }}
      >
        <Box sx={{ color: colors.icon, display: "flex", alignItems: "center" }}>
          {getIcon()}
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: colors.text,
            fontWeight: 500,
            fontSize: "14px",
            flex: 1,
            lineHeight: 1.4,
          }}
        >
          {message}
        </Typography>
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{
            color: colors.text,
            opacity: 0.7,
            "&:hover": {
              opacity: 1,
              backgroundColor: theme.palette.action.hover,
            },
            padding: 0.5,
          }}
        >
          <Close sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
    </Snackbar>
  );
}
