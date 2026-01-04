import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useField, useFormikContext } from "formik";

const DateTimePicker = ({ name, ...otherProps }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (date) => {
    setFieldValue(name, date);
  };

  const configDateTimePicker = {
    ...otherProps,
    value: field.value || null,
    onChange: handleChange,
  };

  const configTextField = {
    variant: "outlined",
    fullWidth: true,
    margin: "dense",
    sx: {
      "& .MuiInputBase-input::placeholder": {
        opacity: 0.4, // Match text field placeholder opacity
        color: "inherit",
      },
    },
  };

  if (meta && meta.touched && meta.error) {
    configTextField.error = true;
    configTextField.helperText = meta.error;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="date picker template"
        {...configDateTimePicker}
        slotProps={{ textField: { ...configTextField } }}
        // renderInput={(params) => <TextField {...params} {...configTextField} margin="dense" />}
      />
    </LocalizationProvider>
  );
};

export default DateTimePicker;
