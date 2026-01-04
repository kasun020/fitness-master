import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Box, IconButton, TextField } from "@mui/material";
import { styled } from "@mui/system";

const NumberInputContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const StyledTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    width: "80px",
    "& input": {
      textAlign: "center",
      padding: "8px 12px",
    },
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  width: "32px",
  height: "32px",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: "50%",
  backgroundColor: theme.palette.background.paper,
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderColor: theme.palette.primary.main,
  },
}));

function NumberInput({ value, onChange, min = 1, max = 999, ...props }) {
  const handleIncrement = () => {
    const newValue = Math.min((value || 0) + 1, max);
    onChange && onChange(null, newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max((value || 0) - 1, min);
    onChange && onChange(null, newValue);
  };

  const handleInputChange = (event) => {
    const inputValue = parseInt(event.target.value) || min;
    const clampedValue = Math.max(min, Math.min(max, inputValue));
    onChange && onChange(event, clampedValue);
  };

  return (
    <NumberInputContainer>
      <StyledIconButton onClick={handleDecrement} disabled={value <= min}>
        <RemoveIcon fontSize="small" />
      </StyledIconButton>

      <StyledTextField
        type="number"
        value={value || min}
        onChange={handleInputChange}
        inputProps={{ min, max }}
        variant="outlined"
        size="small"
        {...props}
      />

      <StyledIconButton onClick={handleIncrement} disabled={value >= max}>
        <AddIcon fontSize="small" />
      </StyledIconButton>
    </NumberInputContainer>
  );
}

export default NumberInput;
