import {
  Cake,
  CalendarMonth,
  CheckCircle,
  CloudUpload,
  FitnessCenter,
  Image as ImageIcon,
  MonitorWeight,
  Person,
  Phone,
  Receipt,
  Wc,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
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
import Select from "../../ui-components/FormsUI/Select";
import TextField from "../../ui-components/FormsUI/TextField";
import "./RegistrationForm.css";

const RegistrationForm = () => {
  const [paymentSlip, setPaymentSlip] = useState(null);
  const [frontBodyPicture, setFrontBodyPicture] = useState(null);
  const [backBodyPicture, setBackBodyPicture] = useState(null);

  const navigate = useNavigate();

  const validate = (values) => {
    const errors = {};
    if (!values.scheduleType) errors.scheduleType = "Schedule type is required";
    if (!values.name) errors.name = "Name is required";
    if (!values.age) errors.age = "Age is required";
    if (!values.gender) errors.gender = "Gender is required";
    if (!values.weight) errors.weight = "Weight is required";
    if (!values.whatsappNumber)
      errors.whatsappNumber = "WhatsApp number is required";
    return errors;
  };

  const scheduleTypeOptions = [
    { value: "Body Building", label: "Body Building" },
    { value: "Fat Burning", label: "Fat Burning" },
    { value: "Ladies", label: "Ladies" },
  ];

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  return (
    <div className="registration-form-container">
      <Box className="registration-header">
        <Box className="registration-icon-wrapper">
          <FitnessCenter className="registration-icon" />
        </Box>
        <Box className="registration-text-content">
          <Typography variant="h4" className="registration-title">
            Request Your Fitness Plan
          </Typography>
          <Typography variant="body2" className="registration-subtitle">
            Fill out the form below to get your personalized workout and diet
            plan
          </Typography>
        </Box>
      </Box>

      <Card className="registration-card" elevation={8}>
        <CardContent sx={{ p: { xs: 3, sm: 5, md: 6 } }}>
          <Formik
            initialValues={{
              scheduleType: "",
              name: "",
              age: "",
              gender: "",
              weight: "",
              whatsappNumber: "",
            }}
            validate={validate}
            onSubmit={async (values, actions) => {
              actions.setSubmitting(true);

              if (!paymentSlip || !frontBodyPicture || !backBodyPicture) {
                openSnackBar("Please upload all required files", "error");
                actions.setSubmitting(false);
                return;
              }

              const formData = new FormData();
              formData.append("scheduleType", values.scheduleType);
              formData.append("name", values.name);
              formData.append("age", values.age);
              formData.append("gender", values.gender);
              formData.append("weight", values.weight);
              formData.append("whatsappNumber", values.whatsappNumber);
              formData.append("paymentSlip", paymentSlip);
              formData.append("frontBodyPicture", frontBodyPicture);
              formData.append("backBodyPicture", backBodyPicture);

              try {
                const res = await api.post("/register/add", formData, {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                });
                console.log(res.data);
                openSnackBar("Registration submitted successfully!", "success");
                navigate("/");
              } catch (err) {
                console.error(err);
                openSnackBar(
                  err?.response?.data?.error || "Registration failed",
                  "error"
                );
              } finally {
                actions.setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form noValidate>
                <Stack spacing={4}>
                  {/* Personal Information Section */}
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 3,
                        color: "var(--orange)",
                        fontWeight: 700,
                        fontSize: "1.3rem",
                      }}
                    >
                      <Person sx={{ mr: 1 }} />
                      Personal Information
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="name"
                          required
                          autoComplete="name"
                          placeholder="Enter your full name"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Person sx={{ color: "white" }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="age"
                          type="number"
                          required
                          placeholder="Enter your age"
                          inputProps={{ min: 0 }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Cake sx={{ color: "white" }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Select
                          name="gender"
                          options={genderOptions}
                          customHandleChange={() => {}}
                          required
                          placeholder="Select your gender"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Wc sx={{ color: "white" }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="whatsappNumber"
                          required
                          autoComplete="tel"
                          placeholder="Enter your WhatsApp number"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Phone sx={{ color: "white" }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="weight"
                          type="number"
                          required
                          placeholder="Enter your weight"
                          inputProps={{ min: 0 }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <MonitorWeight sx={{ color: "white" }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Select
                          name="scheduleType"
                          options={scheduleTypeOptions}
                          customHandleChange={() => {}}
                          required
                          placeholder="Select schedule type"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarMonth sx={{ color: "white" }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  {/* File Uploads Section */}
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 3,
                        color: "var(--orange)",
                        fontWeight: 700,
                        fontSize: "1.3rem",
                      }}
                    >
                      <CloudUpload sx={{ mr: 1 }} />
                      Required Documents
                    </Typography>

                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Box className="upload-box">
                          <Button
                            variant="outlined"
                            component="label"
                            startIcon={<Receipt />}
                            className="upload-button"
                            fullWidth
                          >
                            {paymentSlip
                              ? "Change Payment Slip"
                              : "Upload Payment Slip *"}
                            <input
                              type="file"
                              hidden
                              accept="image/*"
                              onChange={(e) =>
                                setPaymentSlip(e.target.files[0])
                              }
                            />
                          </Button>
                          {paymentSlip && (
                            <Chip
                              icon={<CheckCircle />}
                              label={paymentSlip.name}
                              color="success"
                              sx={{ mt: 1 }}
                              onDelete={() => setPaymentSlip(null)}
                            />
                          )}
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box className="upload-box">
                          <Button
                            variant="outlined"
                            component="label"
                            startIcon={<ImageIcon />}
                            className="upload-button"
                            fullWidth
                          >
                            {frontBodyPicture
                              ? "Change Front Picture"
                              : "Upload Front Body Picture *"}
                            <input
                              type="file"
                              hidden
                              accept="image/*"
                              onChange={(e) =>
                                setFrontBodyPicture(e.target.files[0])
                              }
                            />
                          </Button>
                          {frontBodyPicture && (
                            <Chip
                              icon={<CheckCircle />}
                              label={frontBodyPicture.name}
                              color="success"
                              sx={{ mt: 1 }}
                              onDelete={() => setFrontBodyPicture(null)}
                            />
                          )}
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box className="upload-box">
                          <Button
                            variant="outlined"
                            component="label"
                            startIcon={<ImageIcon />}
                            className="upload-button"
                            fullWidth
                          >
                            {backBodyPicture
                              ? "Change Back Picture"
                              : "Upload Back Body Picture *"}
                            <input
                              type="file"
                              hidden
                              accept="image/*"
                              onChange={(e) =>
                                setBackBodyPicture(e.target.files[0])
                              }
                            />
                          </Button>
                          {backBodyPicture && (
                            <Chip
                              icon={<CheckCircle />}
                              label={backBodyPicture.name}
                              color="success"
                              sx={{ mt: 1 }}
                              onDelete={() => setBackBodyPicture(null)}
                            />
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>

                  <SubmitButton
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    startIcon={<FitnessCenter />}
                    className="registration-submit-btn"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </SubmitButton>
                </Stack>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationForm;
