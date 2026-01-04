import DescriptionIcon from "@mui/icons-material/Description";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import {
  Box,
  Stepper as MuiStepper,
  Step,
  StepConnector,
  StepLabel,
  styled,
} from "@mui/material";
import { stepConnectorClasses } from "@mui/material/StepConnector";
import { StepIconProps } from "@mui/material/StepIcon";

// Styled components for the stepper
const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  zIndex: 1,
  color: "#fff",
  width: 30,
  height: 30,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "1.2rem",
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        backgroundColor: theme.palette.primary.main,
        boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
        transform: "scale(1.1)",
      },
    },
    {
      props: ({ ownerState }) => ownerState.completed,
      style: {
        backgroundColor: theme.palette.primary.main,
      },
    },
  ],
}));

interface CustomStepIconProps extends StepIconProps {
  icons?: { [index: string]: React.ReactElement };
}

function ColorlibStepIcon(props: CustomStepIconProps) {
  const { active, completed, className, icons } = props;

  const defaultIcons: { [index: string]: React.ReactElement } = {
    1: <DescriptionIcon />,
    2: <GroupAddIcon />,
  };

  const iconSet = icons || defaultIcons;

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {iconSet[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

interface StepperProps {
  activeStep: number;
  steps: string[];
  icons?: { [index: string]: React.ReactElement };
  sx?: any;
}

function Stepper({ activeStep, steps, icons, sx }: StepperProps) {
  return (
    <Box sx={{ width: "100%", mb: 3, ...sx }}>
      <MuiStepper
        activeStep={activeStep}
        connector={<QontoConnector />}
        alternativeLabel
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel
              StepIconComponent={(props) => (
                <ColorlibStepIcon {...props} icons={icons} />
              )}
              sx={{
                "& .MuiStepLabel-label": {
                  fontSize: "0.875rem",
                  fontWeight: 500,
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </MuiStepper>
    </Box>
  );
}

export default Stepper;
