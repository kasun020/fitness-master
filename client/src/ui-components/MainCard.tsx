import PropTypes from "prop-types";
import { forwardRef } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
} from "@mui/material";

// constant
const headerSX = {
  "& .MuiCardHeader-action": { mr: 0 },
};

// ==============================|| CUSTOM MAIN CARD ||============================== //

const MainCard = forwardRef(
  (
    {
      border = true,
      boxShadow,
      children,
      content = true,
      contentClass = "",
      contentSX = {},
      darkTitle,
      disableHover = false,
      secondary,
      shadow,
      sx = {},
      title,
      ...others
    }: any,
    ref: any
  ) => {
    const theme: any = useTheme();

    return (
      <Card
        ref={ref}
        {...others}
        sx={{
          width:"100%",
          border: border ? "1px solid" : "none",
          borderColor: border ? theme.palette.grey[200] : "none",
          borderRadius: 3,
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          ...(!disableHover && {
            ":hover": {
              boxShadow: boxShadow
                ? shadow || "0 4px 12px rgba(0, 0, 0, 0.12)"
                : "0 4px 12px rgba(0, 0, 0, 0.12)",
              transform: "translateY(-2px)",
            },
          }),
          ...sx,
        }}
      >
        {/* card header and action */}
        {title && (
          <CardHeader
            sx={headerSX}
            title={
              darkTitle ? (
                <Typography variant="h4">{title}</Typography>
              ) : (
                <Typography variant="h4" color={"GrayText"}>
                  {title}
                </Typography>
              )
            }
            action={secondary}
          />
        )}

        {/* content & header divider */}
        {title && <Divider />}

        {/* card content */}
        {content && (
          <CardContent sx={contentSX} className={contentClass}>
            {children}
          </CardContent>
        )}
        {!content && children}
      </Card>
    );
  }
);

MainCard.propTypes = {
  border: PropTypes.bool,
  boxShadow: PropTypes.bool,
  children: PropTypes.node,
  content: PropTypes.bool,
  contentClass: PropTypes.string,
  contentSX: PropTypes.object,
  darkTitle: PropTypes.bool,
  disableHover: PropTypes.bool,
  secondary: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.object,
  ]),
  shadow: PropTypes.string,
  sx: PropTypes.object,
  title: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.object,
  ]),
};

export default MainCard;
