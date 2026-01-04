import {
  CheckCircle,
  Email,
  FitnessCenter,
  Lock,
  Login as LoginIcon,
  PersonAdd,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import SubmitButton from "../../ui-components/FormsUI/Button";
import TextField from "../../ui-components/FormsUI/TextField";
import "./Signup.css";

function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = (values) => {
    const errors = {};
    if (!values.email) errors.email = "Email is required";
    if (!values.password) errors.password = "Password is required";
    if (!values.confirmPassword)
      errors.confirmPassword = "Confirm Password is required";
    if (
      values.password &&
      values.confirmPassword &&
      values.password !== values.confirmPassword
    ) {
      errors.confirmPassword = "Passwords do not match";
    }
    return errors;
  };

  return (
    <div className="sign-up-container">
      <Box className="signup-header">
        <Box className="signup-icon-wrapper">
          <FitnessCenter className="signup-icon" />
        </Box>
        <Typography variant="h4" className="signup-title">
          Join Our Fitness Community
        </Typography>
        <Typography variant="body2" className="signup-subtitle">
          Start your fitness transformation today
        </Typography>
      </Box>

      <Card className="signup-card" elevation={8}>
        <CardContent sx={{ p: 4 }}>
          <Formik
            initialValues={{ email: "", password: "", confirmPassword: "" }}
            validate={validate}
            onSubmit={async (values, actions) => {
              actions.setSubmitting(true);
              actions.setStatus(undefined);

              try {
                const response = await api.post("/user/signup", {
                  email: values.email,
                  password: values.password,
                  confirmPassword: values.confirmPassword,
                });

                console.log(response.data);
                navigate("/");
              } catch (err) {
                actions.setStatus(err?.response?.data?.error || err.message);
              } finally {
                actions.setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, status }) => (
              <Form noValidate className="my-form">
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
                    autoComplete="new-password"
                    placeholder="Create a password"
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

                  <TextField
                    name="confirmPassword"
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CheckCircle sx={{ color: "#667eea" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  {status && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      {status}
                    </Alert>
                  )}

                  <SubmitButton
                    variant="contained"
                    fullWidth
                    disabled={isSubmitting}
                    startIcon={<PersonAdd />}
                    className="signup-submit-btn"
                  >
                    {isSubmitting ? "Creating Account..." : "Sign Up"}
                  </SubmitButton>

                  <Divider sx={{ my: 2 }}>OR</Divider>

                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Already have an account?
                    </Typography>
                    <Link
                      component={RouterLink}
                      to="/login"
                      underline="none"
                      className="login-link"
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        <LoginIcon sx={{ fontSize: 20 }} />
                        <Typography variant="body1" fontWeight="600">
                          Login Here
                        </Typography>
                      </Box>
                    </Link>
                  </Box>
                </Stack>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignUp;
