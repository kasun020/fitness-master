import { CalendarToday, Close } from "@mui/icons-material";
import {
  Box,
  FormHelperText,
  IconButton,
  InputAdornment,
  Popover,
  styled,
  TextField,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import dayjs, { Dayjs } from "dayjs";
import React, { useState } from "react";

export interface DateRangeValue {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

interface DateRangePickerFieldProps {
  value?: DateRangeValue;
  onChange?: (value: DateRangeValue) => void;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  disabled?: boolean;
  startDateError?: boolean;
  endDateError?: boolean;
  startDateHelperText?: string;
  endDateHelperText?: string;
  startDateLabel?: string;
  endDateLabel?: string;
  size?: "small" | "medium";
  fullWidth?: boolean;
}

// Custom styled day component for range selection
const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) =>
    prop !== "isSelected" &&
    prop !== "isHovered" &&
    prop !== "isStart" &&
    prop !== "isEnd" &&
    prop !== "isBetween",
})<{
  isSelected: boolean;
  isHovered: boolean;
  isStart: boolean;
  isEnd: boolean;
  isBetween: boolean;
}>(({ theme, isSelected, isHovered, isStart, isEnd, isBetween }) => ({
  borderRadius: 0,
  transition: "all 0.2s ease-in-out",
  ...(isSelected && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
  ...(isStart && {
    borderTopLeftRadius: "50%",
    borderBottomLeftRadius: "50%",
  }),
  ...(isEnd && {
    borderTopRightRadius: "50%",
    borderBottomRightRadius: "50%",
  }),
  ...(isBetween && {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      opacity: 0.8,
    },
  }),
  ...(isHovered && {
    backgroundColor: theme.palette.action.hover,
    transform: "scale(1.05)",
  }),
})) as React.ComponentType<
  PickersDayProps<Dayjs> & {
    isSelected: boolean;
    isHovered: boolean;
    isStart: boolean;
    isEnd: boolean;
    isBetween: boolean;
  }
>;

const DateRangePickerField: React.FC<DateRangePickerFieldProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  startDateError = false,
  endDateError = false,
  startDateHelperText,
  endDateHelperText,
  size = "small",
  fullWidth = true,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [hoveredDay, setHoveredDay] = useState<Dayjs | null>(null);
  const [selectingEndDate, setSelectingEndDate] = useState(false);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!disabled) {
      setAnchorEl(event.currentTarget);
      setSelectingEndDate(false);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setHoveredDay(null);
    setSelectingEndDate(false);
  };

  const handleDateChange = (newValue: Dayjs | null) => {
    if (!newValue || !onChange) return;

    if (!selectingEndDate && !value?.startDate) {
      // First click - set start date
      onChange({
        startDate: newValue,
        endDate: null,
      });
      setSelectingEndDate(true);
    } else if (selectingEndDate || value?.startDate) {
      // Second click - set end date
      const startDate = value?.startDate || newValue;
      const endDate = newValue;

      // Ensure end date is after start date
      if (endDate.isBefore(startDate)) {
        // Swap dates if user clicked earlier date
        onChange({
          startDate: endDate,
          endDate: startDate,
        });
      } else {
        onChange({
          startDate,
          endDate,
        });
      }

      // Close after selecting end date
      setTimeout(() => {
        handleClose();
      }, 300);
    }
  };

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onChange) {
      onChange({
        startDate: null,
        endDate: null,
      });
    }
    setSelectingEndDate(false);
  };

  const renderDay = (
    day: Dayjs,
    selectedDays: (Dayjs | null)[],
    pickersDayProps: PickersDayProps<Dayjs>
  ) => {
    const start = value?.startDate;
    const end = value?.endDate || (selectingEndDate ? hoveredDay : null);

    const isStart = start ? day.isSame(start, "day") : false;
    const isEnd = end ? day.isSame(end, "day") : false;

    // Calculate if day is between start and end (or hovered end)
    let isBetween = false;
    if (start && end) {
      const earlierDate = start.isBefore(end) ? start : end;
      const laterDate = start.isBefore(end) ? end : start;
      isBetween =
        day.isAfter(earlierDate, "day") && day.isBefore(laterDate, "day");
    }

    const isSelected = isStart || isEnd;
    const isHovered =
      hoveredDay && selectingEndDate ? day.isSame(hoveredDay, "day") : false;

    return (
      <Box
        onMouseEnter={() => {
          if (selectingEndDate && value?.startDate) {
            setHoveredDay(day);
          }
        }}
        onMouseLeave={() => {
          if (selectingEndDate) {
            setHoveredDay(null);
          }
        }}
      >
        <CustomPickersDay
          {...pickersDayProps}
          day={day}
          isSelected={isSelected}
          isHovered={isHovered}
          isStart={isStart}
          isEnd={isEnd}
          isBetween={isBetween}
        />
      </Box>
    );
  };

  const formatDateRange = () => {
    if (!value?.startDate && !value?.endDate) return "";
    if (value?.startDate && !value?.endDate) {
      return `${value.startDate.format("MMM DD, YYYY")} - Select end date`;
    }
    if (value?.startDate && value?.endDate) {
      return `${value.startDate.format(
        "MMM DD, YYYY"
      )} - ${value.endDate.format("MMM DD, YYYY")}`;
    }
    return "";
  };

  const hasError = startDateError || endDateError;
  const helperText = startDateHelperText || endDateHelperText;

  return (
    <Box sx={{ width: fullWidth ? "100%" : "auto" }}>
      <TextField
        fullWidth={fullWidth}
        size={size}
        value={formatDateRange()}
        onClick={handleClick}
        placeholder="Select date range"
        disabled={disabled}
        error={hasError}
        InputProps={{
          readOnly: true,
          startAdornment: (
            <InputAdornment position="start">
              <CalendarToday fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: value?.startDate && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleClear}
                disabled={disabled}
              >
                <Close fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
          sx: {
            cursor: disabled ? "default" : "pointer",
          },
        }}
      />
      {helperText && (
        <FormHelperText error={hasError} sx={{ mx: 1.75, mt: 0.5 }}>
          {helperText}
        </FormHelperText>
      )}

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              boxShadow: 3,
            },
          },
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={value?.startDate || dayjs()}
            onChange={handleDateChange}
            minDate={minDate}
            maxDate={maxDate}
            slots={{
              day: (dayProps: PickersDayProps<Dayjs>) =>
                renderDay(dayProps.day, [], dayProps),
            }}
          />
        </LocalizationProvider>
      </Popover>
    </Box>
  );
};

export default DateRangePickerField;
