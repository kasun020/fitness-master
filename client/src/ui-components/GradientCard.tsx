import { styled } from "@mui/material";
import MainCard from "./MainCard";

export interface GradientCardProps {
  colorScheme?:
    | "primary"
    | "secondary"
    | "info"
    | "success"
    | "warning"
    | "error";
  circleSize?: "small" | "medium" | "large";
  height?: string;
  maxWidth?: string;
}

const GradientCard = styled(MainCard, {
  shouldForwardProp: (prop) =>
    !["colorScheme", "circleSize", "height", "maxWidth"].includes(
      prop as string
    ),
})<GradientCardProps>(
  ({
    theme,
    colorScheme = "primary",
    circleSize = "large",
    height,
    maxWidth,
  }) => {
    // Get colors based on scheme
    const colors = theme.palette[colorScheme];

    // Circle sizes configuration
    const circleConfig = {
      small: {
        width: 150,
        height: 150,
        topAfter: -60,
        rightAfter: -60,
        topBefore: -90,
        rightBefore: -10,
      },
      medium: {
        width: 180,
        height: 180,
        topAfter: -70,
        rightAfter: -75,
        topBefore: -105,
        rightBefore: -12,
      },
      large: {
        width: 210,
        height: 210,
        topAfter: -85,
        rightAfter: -95,
        topBefore: -125,
        rightBefore: -15,
      },
    };

    const config = circleConfig[circleSize];

    return {
      background: `linear-gradient(135deg, ${colors.main} 0%, ${colors.dark} 100%)`,
      color: colors.contrastText,
      overflow: "hidden",
      position: "relative",
      border: "none",
      ...(height && { height }),
      ...(maxWidth && { maxWidth }),
      ...(height && { display: "flex", flexDirection: "column" }),

      "&:after": {
        content: '""',
        position: "absolute",
        width: config.width,
        height: config.height,
        background: `linear-gradient(210.04deg, ${colors.light} -50.94%, rgba(255,255,255,0.1) 83.49%)`,
        borderRadius: "50%",
        top: config.topAfter,
        right: config.rightAfter,
      },
      "&:before": {
        content: '""',
        position: "absolute",
        width: config.width,
        height: config.height,
        background: `linear-gradient(140.9deg, ${colors.light} -14.02%, rgba(255,255,255,0.05) 77.58%)`,
        borderRadius: "50%",
        top: config.topBefore,
        right: config.rightBefore,
      },
    };
  }
);

export default GradientCard;
