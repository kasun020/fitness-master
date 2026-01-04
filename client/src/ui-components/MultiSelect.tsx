import {
  Box,
  Chip,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  label?: string;
  minWidth?: string;
  showAllOption?: boolean;
  allOptionLabel?: string;
  disabled?: boolean;
}

export default function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  minWidth = "15rem",
  showAllOption = true,
  allOptionLabel = "All",
  disabled = false,
}: MultiSelectProps) {
  const ALL_VALUE = "__all__";

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const selectedValue = event.target.value;
    const selectedArray =
      typeof selectedValue === "string"
        ? selectedValue.split(",")
        : selectedValue;

    // If "All" is selected, select all options
    if (selectedArray.includes(ALL_VALUE)) {
      onChange(options.map((opt) => opt.value));
    } else {
      onChange(selectedArray);
    }
  };

  const handleDelete = (valueToDelete: string) => (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    onChange(value.filter((val) => val !== valueToDelete));
  };

  const handleChipMouseDown = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <FormControl size="small" sx={{ minWidth, width: "100%" }}>
      <Select
        multiple
        value={value}
        onChange={handleChange}
        displayEmpty
        disabled={disabled}
        renderValue={(selected) => (
          <Box
            sx={{
              display: "flex",
              gap: "0.25rem",
              flexWrap: "nowrap",
              overflow: "hidden",
              alignItems: "center",
              maxWidth: "100%",
            }}
          >
            {selected.length === 0 ? (
              <Box sx={{ color: "text.secondary" }}>{placeholder}</Box>
            ) : selected.length === options.length && showAllOption ? (
              <Box sx={{ color: "text.primary", fontSize: "0.875rem" }}>
                {allOptionLabel}
              </Box>
            ) : (
              <>
                <Box
                  sx={{
                    display: "flex",
                    gap: "0.25rem",
                    flexWrap: "nowrap",
                    overflow: "auto",
                    alignItems: "center",
                    flex: 1,
                    "&::-webkit-scrollbar": {
                      height: "4px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "rgba(0,0,0,0.2)",
                      borderRadius: "4px",
                    },
                  }}
                >
                  {selected.slice(0, 3).map((selectedValue) => {
                    const option = options.find(
                      (opt) => opt.value === selectedValue
                    );
                    return (
                      <Chip
                        key={selectedValue}
                        label={option?.label || selectedValue}
                        size="small"
                        onDelete={handleDelete(selectedValue)}
                        onMouseDown={handleChipMouseDown}
                        sx={{
                          height: "24px",
                          fontSize: "0.8125rem",
                          flexShrink: 0,
                        }}
                      />
                    );
                  })}
                </Box>
                {selected.length > 3 && (
                  <Box
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.8125rem",
                      whiteSpace: "nowrap",
                      ml: 0.5,
                      flexShrink: 0,
                    }}
                  >
                    +{selected.length - 3}
                  </Box>
                )}
              </>
            )}
          </Box>
        )}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 280,
            },
          },
        }}
      >
        {showAllOption && (
          <MenuItem value={ALL_VALUE}>{allOptionLabel}</MenuItem>
        )}
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
