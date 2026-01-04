import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

const Modal = ({ message, onClose }) => {
  return (
    <Dialog open onClose={onClose} aria-labelledby="login-error-title">
      <DialogTitle id="login-error-title">Error</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
