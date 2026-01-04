import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import error_light_404 from "../../assets/images/404-error.png";
import error_dark_404 from "../../assets/images/404-error.png";

const UnauthorizedAccess = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <>
      <Box
        component="main"
        sx={{
          alignItems: "center",
          display: "flex",
          flexGrow: 1,
          minHeight: "100%",
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <img
                alt="Under development"
                src={
                  theme.palette.mode === "light"
                    ? error_light_404
                    : error_dark_404
                }
                style={{
                  marginTop: 50,
                  display: "inline-block",
                  maxWidth: "80%",
                  width: 560,
                }}
              />
            </Box>
            <Typography align="center" color="primary" variant="h1">
              404: The page you are looking for isn’t here
            </Typography>
            <Typography align="center" color="secondary" variant="subtitle2">
              You either tried some shady route or you came here by mistake.
              Whichever it is, try using the navigation
            </Typography>
            <Button
              component="a"
              startIcon={<ArrowBackIcon fontSize="small" />}
              sx={{ mt: 3 }}
              variant="contained"
              onClick={() => navigate("/dashboard")}
            >
              Go back to dashboard
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default UnauthorizedAccess;
