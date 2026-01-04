import { TextField } from "@mui/material";
import { useField } from "formik";

const TextFieldWrapper = ({ name, ...otherProps }) => {
  const [field, mata] = useField(name);

  const configTextfield = {
    ...field,
    ...otherProps,
    fullWidth: true,
    variant: "outlined",
    sx: {
      "& .MuiInputBase-input::placeholder": {
        opacity: 0.4, // Increased opacity for text field placeholders
        color: "inherit",
      },
      ...otherProps.sx,
    },
  };

  if (mata && mata.touched && mata.error) {
    configTextfield.error = true;
    configTextfield.helperText = mata.error;
  }

  return <TextField {...configTextfield} margin="dense" />;
};

export default TextFieldWrapper;
