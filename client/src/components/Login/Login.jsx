import {
  Email,
  FitnessCenter,
  Lock,
  Login as LoginIcon,
  PersonAdd,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { openSnackBar } from "../../ui-components/CustomSnackBar";
import SubmitButton from "../../ui-components/FormsUI/Button";
import TextField from "../../ui-components/FormsUI/TextField";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const validate = (values) => {
    const errors = {};
    if (!values.email) errors.email = "Email is required";
    if (!values.password) errors.password = "Password is required";
    return errors;
  };

  return (
    <div className="login-container">
      <Box className="login-header">
        <Box className="login-icon-wrapper">
          <FitnessCenter className="login-icon" />
        </Box>
        <Typography variant="h4" className="login-title">
          Welcome Back
        </Typography>
        <Typography variant="body2" className="login-subtitle">
          Sign in to access your fitness journey
        </Typography>
      </Box>

      <Card className="login-card" elevation={8}>
        <CardContent sx={{ p: 4 }}>
          <Formik
            initialValues={{ email: "", password: "" }}
            validate={validate}
            onSubmit={async (values, actions) => {
              actions.setSubmitting(true);
              try {
                const response = await api.post(`/auth/login`, {
                  email: values.email,
                  password: values.password,
                });

                const { token, role } = response.data;
                localStorage.setItem("token", token);
                localStorage.setItem("role", role);

                if (role === "admin") {
                  navigate("/dashboard");
                } else {
                  navigate("/");
                }
              } catch (err) {
                console.error("Login failed", err);
                openSnackBar(
                  err?.response?.data?.error || "Failed to log in",
                  "error"
                );
              } finally {
                actions.setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, values, handleChange, handleBlur }) => (
              <Form noValidate>
                <Stack spacing={3}>
                  <TextField
                    name="email"
                    label="Email Address"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Enter your email"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: "#667eea" }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: "#667eea" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <SubmitButton
                    variant="contained"
                    fullWidth
                    disabled={isSubmitting}
                    startIcon={<LoginIcon />}
                    className="login-submit-btn"
                  >
                    {isSubmitting ? "Logging in..." : "Login"}
                  </SubmitButton>

                  <Divider sx={{ my: 2 }}>OR</Divider>

                  <Button
                    type="button"
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate("/signup")}
                    startIcon={<PersonAdd />}
                    className="signup-link-btn"
                  >
                    Create New Account
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
