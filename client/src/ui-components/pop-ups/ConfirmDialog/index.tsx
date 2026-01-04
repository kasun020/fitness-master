import CancelIcon from "@mui/icons-material/Cancel";
import { Box, Container, Grid } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import * as React from "react";
import { create } from "zustand";
import {
  ModelButton,
  ModelClose,
  ModelContentText,
  ModelTitle,
  StatusIcon,
} from "../styles";

type ConfirmDialogStore = {
  title: string;
  message: string;
  data: any;
  onSubmit?: (p: any) => void;
  confirmBtnDisable?: boolean;
  close: boolean;
};

const useConfirmDialogStore = create<ConfirmDialogStore>(() => ({
  title: "",
  message: "",
  data: undefined,
  onSubmit: undefined,
  confirmBtnDisable: false,
  close: false,
}));

export const openConfirmDialog = (
  title: string,
  message: string,
  data: any,
  onSubmit?: (p: any) => void
) => {
  useConfirmDialogStore.setState({
    title: title,
    message: message,
    data: data,
    onSubmit: onSubmit,
    confirmBtnDisable: false,
    close: true,
  });
};

export const disableBtnConfirmDialog = (val: boolean) => {
  useConfirmDialogStore.setState({
    confirmBtnDisable: val,
  });
};

export const closeConfirmDialog = () => {
  useConfirmDialogStore.setState({
    close: false,
  });
};

const ConfirmDialog: React.FC = () => {
  const { title, message, data, onSubmit, confirmBtnDisable, close } =
    useConfirmDialogStore();

  const handleClose = () => {
    useConfirmDialogStore.setState({
      close: false,
    });
  };

  return (
    <div>
      <Dialog
        open={close}
        onClose={handleClose}
        fullWidth={true}
        PaperProps={{
          style: { borderRadius: 15 },
        }}
      >
        <ModelClose color="primary" onClick={handleClose}>
          <CancelIcon />
        </ModelClose>
        <Container>
          <Grid
            container
            style={{ marginTop: "40px", justifyContent: "center" }}
            direction="row"
          >
            <Grid item>
              <StatusIcon color="warning">error</StatusIcon>
            </Grid>
          </Grid>
        </Container>
        <ModelTitle color="warning">{title}</ModelTitle>
        <DialogContent style={{ textAlign: "center" }}>
          <ModelContentText dangerouslySetInnerHTML={{ __html: message }} />
          {/* <ModelContentText>{message}</ModelContentText> */}
        </DialogContent>
        <DialogActions style={{ display: "flex", justifyContent: "center" }}>
          <ModelButton onClick={handleClose} variant="outlined" color="primary">
            Cancel
          </ModelButton>
          <Box style={{ width: 10 }} />
          <ModelButton
            onClick={() => {
              if (onSubmit) {
                onSubmit(data);
              }
              handleClose();
            }}
            variant="contained"
            color="primary"
            disabled={confirmBtnDisable}
          >
            Confirm
          </ModelButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ConfirmDialog;
