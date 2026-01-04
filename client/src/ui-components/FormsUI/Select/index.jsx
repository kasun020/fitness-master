import { MenuItem, TextField } from "@mui/material";
import { useField, useFormikContext } from "formik";

const SelectWrapper = ({
  name,
  options,
  customHandleChange,
  placeholder = "Select an option",
  ...otherProps
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (evt) => {
    const { value } = evt.target;
    setFieldValue(name, value);
    customHandleChange(evt);
  };

  const configSelect = {
    ...field,
    ...otherProps,
    variant: "outlined",
    fullWidth: true,
    select: true,
    margin: "dense",
    onChange: handleChange,
    sx: {
      "& .MuiInputBase-input": {
        color: field.value ? "inherit" : "rgba(0, 0, 0, 0.6)", // Increased opacity for dropdown placeholder (light mode)
      },
      "& .MuiInputLabel-root": {
        opacity: 0.8, // Increased opacity for dropdown label
      },
      // Dark mode support
      "@media (prefers-color-scheme: dark)": {
        "& .MuiInputBase-input": {
          color: field.value ? "inherit" : "rgba(255, 255, 255, 0.6)", // Increased opacity for dark mode
        },
      },
      ...otherProps.sx,
    },
  };

  if (meta && meta.touched && meta.error) {
    configSelect.error = true;
    configSelect.helperText = meta.error;
  }

  return (
    <TextField {...configSelect}>
      <MenuItem value="" disabled>
        <em>{placeholder}</em>
      </MenuItem>
      {options.length > 0 ? (
        options.map((item, pos) => (
          <MenuItem key={pos} value={item.value}>
            {item.label}
          </MenuItem>
        ))
      ) : (
        <MenuItem disabled>No Data</MenuItem>
      )}
    </TextField>
  );
};

export default SelectWrapper;
