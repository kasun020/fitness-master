import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import GppMaybeIcon from "@mui/icons-material/GppMaybe";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useState } from "react";

export interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (note?: string) => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: "error" | "success" | "primary" | "warning" | "info";
  showReasonField?: boolean;
  reasonLabel?: string;
  reasonPlaceholder?: string;
  reasonRequired?: boolean;
  icon?: React.ReactNode;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "primary",
  showReasonField = false,
  reasonLabel = "Reason",
  reasonPlaceholder = "Provide a reason...",
  reasonRequired = false,
  icon,
}) => {
  const theme: any = useTheme();
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");

  const handleClose = () => {
    setReason("");
    setReasonError("");
    onClose();
  };

  const handleConfirm = () => {
    if (showReasonField && reasonRequired && !reason.trim()) {
      setReasonError(`${reasonLabel} is required`);
      return;
    }

    onConfirm(reason.trim());
    setReason("");
    setReasonError("");
  };

  const getColorConfig = () => {
    const configs = {
      error: {
        main: theme.palette.error.main,
        lighter: theme.palette.error.lighter,
      },
      success: {
        main: theme.palette.success.main,
        lighter: theme.palette.success.lighter || theme.palette.grey[50],
      },
      primary: {
        main: theme.palette.primary.main,
        lighter: theme.palette.primary.lighter || theme.palette.grey[50],
      },
      warning: {
        main: theme.palette.warning.main,
        lighter: theme.palette.warning.lighter || theme.palette.grey[50],
      },
      info: {
        main: theme.palette.info.main,
        lighter: theme.palette.info.lighter || theme.palette.grey[50],
      },
    };
    return configs[confirmColor];
  };

  const colorConfig = getColorConfig();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          border: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          pb: 2,
          pt: 3,
          px: 3,
        }}
      >
        <Box
          sx={{
            width: 4,
            height: 32,
            bgcolor: colorConfig.main,
            borderRadius: 1,
          }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight={600} color="text.primary">
            {title}
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            color: theme.palette.grey[500],
            "&:hover": {
              color: theme.palette.grey[700],
              backgroundColor: theme.palette.grey[100],
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 4, px: 3, pb: showReasonField ? 2 : 4 }}>
        {(icon ||
          confirmColor === "warning" ||
          confirmColor === "error" ||
          confirmColor === "success") && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 2,
              color: colorConfig.main,
            }}
          >
            {icon ||
              (confirmColor === "warning" ? (
                <GppMaybeIcon sx={{ fontSize: 56 }} />
              ) : confirmColor === "error" ? (
                <DeleteForeverIcon sx={{ fontSize: 48 }} />
              ) : confirmColor === "success" ? (
                <CheckCircleIcon sx={{ fontSize: 48 }} />
              ) : null)}
          </Box>
        )}
        <Typography
          variant="body1"
          color="text.primary"
          sx={{
            lineHeight: 1.8,
            textAlign: "center",
            fontSize: "1rem",
            mb: showReasonField ? 3 : 0,
          }}
        >
          {message}
        </Typography>

        {showReasonField && (
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={4}
            label={reasonLabel}
            placeholder={reasonPlaceholder}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (reasonError) setReasonError("");
            }}
            error={!!reasonError}
            helperText={reasonError}
            required={reasonRequired}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                backgroundColor: theme.palette.background.paper,
              },
              "& .MuiInputLabel-root": {
                fontWeight: 500,
              },
            }}
          />
        )}
      </DialogContent>

      <Divider />

      <DialogActions
        sx={{
          px: 3,
          py: 2.5,
          gap: 1.5,
          justifyContent: "center",
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          color="inherit"
          size="large"
          sx={{
            minWidth: 120,
            fontWeight: 600,
            textTransform: "none",
            borderRadius: 1,
            px: 3,
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color={confirmColor}
          size="large"
          sx={{
            minWidth: 120,
            fontWeight: 600,
            textTransform: "none",
            borderRadius: 1,
            px: 3,
            boxShadow: 2,
            "&:hover": {
              boxShadow: 3,
            },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
