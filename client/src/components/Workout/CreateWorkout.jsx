import { useEffect, useState } from "react";
import "./createWorkout.css";

import {
  CalendarMonth,
  ExpandMore,
  FitnessCenter,
  Image as ImageIcon,
  Notes,
  Person,
  Receipt,
  Restaurant,
  Save,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { api } from "../../services/api";
import { openSnackBar } from "../../ui-components/CustomSnackBar";

const CreateWorkout = () => {
  const { id } = useParams();

  const { users, updateStatus } = useGlobalContext();

  const [registration, setRegistration] = useState(null);

  const [scheduleType, setScheduleType] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("");
  const [description, setDescription] = useState("");
  const [frontImage, setFrontImage] = useState();
  const [backImage, setBackImage] = useState();
  const [paymentSlip, setPaymentSlip] = useState();

  const [dietCalories, setDietCalories] = useState("");
  const [dietNotes, setDietNotes] = useState("");
  const [dietMeals, setDietMeals] = useState([
    {
      mealType: "Morning Drink",
      notes: "A green tea or a black coffee (without sugar)",
    },
    {
      mealType: "Breakfast",
      notes:
        "Option 01 - 120g Chickpeas or kidney beans with three egg whites\n" +
        "Option 02 - Four slices of brown bread with 100g pan fried chicken\n" +
        "Option 03 - Oat-shake - 60g oats, 200ml fresh milk, 1 tbsp peanut butter, 2-3 dates and one banana (blend well)",
    },
    {
      mealType: "Lunch",
      notes:
        "200g cooked rice with one cup boiled or air fried vegetables (carrot, cabbage, beans) or any vegetable curry + 100g chicken or fish",
    },
    {
      mealType: "Evening Snack",
      notes: "An orange or an apple",
    },
    {
      mealType: "Dinner",
      notes:
        "Option 01 - 150g sweet potatoes with 100g chicken or fish\n" +
        "Option 02 - 150g cooked rice with a vegetable curry and 100g chicken or fish\n" +
        "Option 03 - Three chapatti with 100g chicken or fish",
    },
  ]);

  const [workoutDaysUi, setWorkoutDaysUi] = useState([
    {
      dayNumber: 1,
      dayName: "Monday - Push",
      text:
        "DB Shoulder Press | sets: 3 | reps: 8-12\n" +
        "Dips | sets: 3 | reps: 8-12\n" +
        "Pec Flyes | sets: 4 | reps: 10-12\n" +
        "Lateral Raises | sets: 4 | reps: 12-15\n" +
        "Seated Tricep Extensions | sets: 4 | reps: 10-12",
    },
    {
      dayNumber: 2,
      dayName: "Tuesday - Pull",
      text:
        "Pull Ups | sets: 3 | reps: 6-10\n" +
        "Reverse Grip Pulldowns | sets: 4 | reps: 8-12\n" +
        "Incline DB Curls | sets: 3 | reps: 10-12\n" +
        "Close Grip Machine Row | sets: 4 | reps: 8-12\n" +
        "Face Pulls | sets: 3 | reps: 12-15",
    },
    {
      dayNumber: 3,
      dayName: "Wednesday - Legs",
      text:
        "Squats | sets: 4 | reps: 6-10\n" +
        "RDLS | sets: 4 | reps: 8-12\n" +
        "Leg Extensions | sets: 3 | reps: 10-15\n" +
        "Lying Leg Curls | sets: 3 | reps: 10-15\n" +
        "Calf Raises | sets: 4 | reps: 12-20",
    },
  ]);

  const [adminNotes, setAdminNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateMealNotes = (mealType, notes) => {
    setDietMeals((prev) =>
      prev.map((m) => (m.mealType === mealType ? { ...m, notes } : m))
    );
  };

  const updateWorkoutDayText = (dayNumber, text) => {
    setWorkoutDaysUi((prev) =>
      prev.map((d) => (d.dayNumber === dayNumber ? { ...d, text } : d))
    );
  };

  const parseExercises = (text) => {
    const lines = String(text || "")
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    return lines.map((line) => {
      // Supported examples:
      // "Bench Press | sets: 4 | reps: 8-12"
      // "Bench Press - 4 - 8-12"
      // "Bench Press"
      let name = line;
      let sets;
      let reps;

      const parts = line.split("|").map((p) => p.trim());
      if (parts.length > 1) {
        name = parts[0];
        for (const part of parts.slice(1)) {
          const mSets = part.match(/sets\s*:?\s*(\d+)/i);
          if (mSets) sets = Number(mSets[1]);
          const mReps = part.match(/reps\s*:?\s*([\w\-\s]+)/i);
          if (mReps) reps = mReps[1].trim();
        }
      } else {
        const dash = line.split("-").map((p) => p.trim());
        if (dash.length >= 3) {
          name = dash[0];
          const maybeSets = Number(dash[1]);
          if (!Number.isNaN(maybeSets)) sets = maybeSets;
          reps = dash.slice(2).join(" - ");
        }
      }

      return {
        name,
        sets,
        reps,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    try {
      const workoutDays = workoutDaysUi
        .map((d) => {
          const exercises = parseExercises(d.text);
          const notes = String(d.text || "");
          return {
            dayNumber: d.dayNumber,
            dayName: d.dayName,
            notes,
            exercises,
          };
        })
        .filter(
          (d) =>
            (d.notes || "").trim().length > 0 || (d.exercises || []).length > 0
        );

      await api.post(`/workout-plan/create/${id}`, {
        planName: `${name} - Workout Plan`,
        scheduleType,
        generalInstructions: description,
        workoutDays,
        status: "active",
      });

      await api.post(`/diet-plan/create/${id}`, {
        dailyCalories: dietCalories ? Number(dietCalories) : undefined,
        generalNotes: dietNotes,
        mealsPerDay: dietMeals?.length || undefined,
        meals: (dietMeals || [])
          .map((m) => ({
            mealType: m.mealType,
            notes: m.notes,
            foods: [],
          }))
          .filter((m) => (m.notes || "").trim().length > 0),
        status: "active",
      });

      // Keep status as approved (default flow)
      await updateStatus(id, "approved");

      openSnackBar("Plans created successfully.", "success");
    } catch (error) {
      console.error(error);
      openSnackBar(error?.response?.data?.error || error.message, "error");
    } finally {
      setSubmitting(false);
    }

    // // Prepare the data object to send
    // const formData = {
    //   scheduleType: scheduleType,
    //   Username: name,
    //   Instructions: description,
    //   day1workout: day1workout,
    //   day2workout: day2workout,
    //   day3workout: day3workout,
    // };

    // try {
    //   // Send a POST request to the backend API
    //   const response = await axios.post(
    //     `http://localhost:5000/api/add-workout/:userId`, // Replace with your actual endpoint
    //     formData
    //   );

    //   console.log("Workout added successfully:", response.data);
    //   // Optionally, you can add navigation logic here if needed
    // } catch (error) {
    //   console.error("Error adding workout:", error.message);
    // }
  };

  useEffect(() => {
    // Prefer context list (fast), otherwise fetch directly.
    const fromContext = users?.find((u) => u._id === id);
    if (fromContext) {
      setRegistration(fromContext);
      return;
    }

    let mounted = true;
    api
      .get(`/register/${id}`)
      .then((res) => {
        if (!mounted) return;
        setRegistration(res.data);
      })
      .catch(() => {
        // Ignore here; UI will just not pre-fill.
      });

    return () => {
      mounted = false;
    };
  }, [users, id]);

  useEffect(() => {
    if (!registration) return;

    setName(registration.name);
    setAge(registration.age);
    setWeight(registration.weight);
    setGender(registration.gender);
    setScheduleType(registration.scheduleType);

    // Prefer Cloudinary URL; fall back to legacy in-DB image if present
    setPaymentSlip(registration.paymentSlip?.url);
    setFrontImage(registration.frontBodyPicture?.url);
    setBackImage(registration.backBodyPicture?.url);
  }, [registration]);

  return (
    <div className="create-workout-form-container">
      <Box
        className="page-header"
        sx={{ mb: 4, pb: 3, borderBottom: "2px solid #e0e0e0" }}
      >
        <Typography
          variant="h4"
          className="page-title"
          sx={{ fontWeight: 700, display: "flex", alignItems: "center", mb: 1 }}
        >
          <FitnessCenter sx={{ mr: 1.5, fontSize: 38, color: "#667eea" }} />
          Assign Fitness Plans
        </Typography>
        <Typography
          variant="body1"
          className="page-subtitle"
          sx={{ color: "text.secondary", ml: 6.5 }}
        >
          Create personalized workout and diet plans for your client
        </Typography>
      </Box>

      <Grid
        container
        spacing={4}
        sx={{ maxWidth: "1400px", mx: "auto", px: 2 }}
      >
        {/* Personal Information Card */}
        <Grid item xs={12}>
          <Card
            className="info-card"
            elevation={2}
            sx={{ borderRadius: 2, overflow: "hidden" }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box
                className="section-header"
                sx={{ display: "flex", alignItems: "center", mb: 2 }}
              >
                <Person sx={{ mr: 1.5, color: "#667eea", fontSize: 28 }} />
                <Typography
                  variant="h5"
                  className="section-title"
                  sx={{ fontWeight: 600 }}
                >
                  Personal Information
                </Typography>
              </Box>
              <Divider
                sx={{ mb: 4, borderColor: "#667eea", borderWidth: 1.5 }}
              />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box className="info-item">
                    <Typography variant="caption" color="textSecondary">
                      Full Name
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      {name || "N/A"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box className="info-item">
                    <Typography variant="caption" color="textSecondary">
                      Age
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      {age} years
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box className="info-item">
                    <Typography variant="caption" color="textSecondary">
                      Gender
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      {gender || "N/A"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box className="info-item">
                    <Typography variant="caption" color="textSecondary">
                      Weight
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      {weight} kg
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Chip
                    label={scheduleType || "No Schedule"}
                    color="primary"
                    icon={<CalendarMonth />}
                    sx={{ fontWeight: 600 }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Images Card */}
        <Grid item xs={12}>
          <Card
            className="info-card"
            elevation={2}
            sx={{ borderRadius: 2, overflow: "hidden" }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box
                className="section-header"
                sx={{ display: "flex", alignItems: "center", mb: 2 }}
              >
                <ImageIcon sx={{ mr: 1.5, color: "#667eea", fontSize: 28 }} />
                <Typography
                  variant="h5"
                  className="section-title"
                  sx={{ fontWeight: 600 }}
                >
                  Uploaded Images
                </Typography>
              </Box>
              <Divider
                sx={{ mb: 4, borderColor: "#667eea", borderWidth: 1.5 }}
              />

              <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <Box className="image-container">
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      fontWeight="600"
                    >
                      <Receipt sx={{ fontSize: 18, mr: 0.5 }} />
                      Payment Slip
                    </Typography>
                    {paymentSlip ? (
                      <Box
                        component="img"
                        src={paymentSlip}
                        alt="payment slip"
                        className="preview-image"
                      />
                    ) : (
                      <Box className="no-image">
                        <Receipt sx={{ fontSize: 40, color: "#bdbdbd" }} />
                        <Typography variant="caption" color="textSecondary">
                          No image
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box
                    className="image-container"
                    sx={{
                      border: "2px solid #e0e0e0",
                      borderRadius: 2,
                      p: 2,
                      height: "100%",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      fontWeight="700"
                      sx={{ display: "flex", alignItems: "center", mb: 2 }}
                    >
                      <ImageIcon
                        sx={{ fontSize: 20, mr: 1, color: "#667eea" }}
                      />
                      Front View
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    {frontImage ? (
                      <Box
                        component="img"
                        src={frontImage}
                        alt="front body"
                        className="preview-image"
                      />
                    ) : (
                      <Box className="no-image">
                        <ImageIcon sx={{ fontSize: 40, color: "#bdbdbd" }} />
                        <Typography variant="caption" color="textSecondary">
                          No image
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box
                    className="image-container"
                    sx={{
                      border: "2px solid #e0e0e0",
                      borderRadius: 2,
                      p: 2,
                      height: "100%",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      fontWeight="700"
                      sx={{ display: "flex", alignItems: "center", mb: 2 }}
                    >
                      <ImageIcon
                        sx={{ fontSize: 20, mr: 1, color: "#667eea" }}
                      />
                      Back View
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    {backImage ? (
                      <Box
                        component="img"
                        src={backImage}
                        alt="back body"
                        className="preview-image"
                      />
                    ) : (
                      <Box className="no-image">
                        <ImageIcon sx={{ fontSize: 40, color: "#bdbdbd" }} />
                        <Typography variant="caption" color="textSecondary">
                          No image
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Form Section */}
        <Grid item xs={12}>
          <Divider sx={{ my: 4, borderWidth: 2, borderColor: "#e0e0e0" }} />
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={4}>
              {/* General Instructions Card */}
              <Card
                className="info-card"
                elevation={2}
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid #e0e0e0",
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box
                    className="section-header"
                    sx={{ display: "flex", alignItems: "center", mb: 2 }}
                  >
                    <Notes sx={{ mr: 1.5, color: "#667eea", fontSize: 28 }} />
                    <Typography
                      variant="h5"
                      className="section-title"
                      sx={{ fontWeight: 600 }}
                    >
                      General Instructions
                    </Typography>
                  </Box>
                  <Divider
                    sx={{ mb: 4, borderColor: "#667eea", borderWidth: 1.5 }}
                  />

                  <TextField
                    label="Overall Instructions & Goals"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Enter general instructions, goals, and guidelines for the client..."
                    className="professional-input"
                  />
                </CardContent>
              </Card>

              {/* Diet Plan and Workout Plan Side by Side */}
              <Grid container spacing={4}>
                {/* Diet Plan Card */}
                <Grid item xs={12} md={6}>
                  <Card
                    className="info-card"
                    elevation={2}
                    sx={{
                      borderRadius: 2,
                      overflow: "hidden",
                      border: "1px solid #e0e0e0",
                      height: "100%",
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box
                        className="section-header"
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Restaurant
                          sx={{ mr: 1.5, color: "#667eea", fontSize: 28 }}
                        />
                        <Typography
                          variant="h5"
                          className="section-title"
                          sx={{ fontWeight: 600 }}
                        >
                          Diet Plan
                        </Typography>
                      </Box>
                      <Divider
                        sx={{ mb: 4, borderColor: "#667eea", borderWidth: 1.5 }}
                      />

                      <Stack spacing={3}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Daily Calories Target"
                              type="number"
                              value={dietCalories}
                              onChange={(e) => setDietCalories(e.target.value)}
                              placeholder="e.g. 2200"
                              fullWidth
                              inputProps={{ min: 0 }}
                              className="professional-input"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="General Diet Notes"
                              value={dietNotes}
                              onChange={(e) => setDietNotes(e.target.value)}
                              placeholder="Overall diet guidelines..."
                              fullWidth
                              className="professional-input"
                            />
                          </Grid>
                        </Grid>

                        <Divider sx={{ my: 3 }} />
                        <Box>
                          <Typography
                            variant="h6"
                            fontWeight="700"
                            gutterBottom
                            sx={{ mb: 3, color: "#667eea" }}
                          >
                            Daily Meals Plan
                          </Typography>
                          <Stack spacing={2}>
                            {dietMeals.map((m, index) => (
                              <Accordion
                                key={m.mealType}
                                defaultExpanded={index === 0}
                              >
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                  <Typography fontWeight="600">
                                    {m.mealType}
                                  </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                  <TextField
                                    value={m.notes}
                                    onChange={(e) =>
                                      updateMealNotes(
                                        m.mealType,
                                        e.target.value
                                      )
                                    }
                                    placeholder={`Enter ${m.mealType} details...`}
                                    fullWidth
                                    multiline
                                    rows={4}
                                    className="professional-input"
                                  />
                                </AccordionDetails>
                              </Accordion>
                            ))}
                          </Stack>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Workout Plan Card */}
                <Grid item xs={12} md={6}>
                  <Card
                    className="info-card"
                    elevation={2}
                    sx={{
                      borderRadius: 2,
                      overflow: "hidden",
                      border: "1px solid #e0e0e0",
                      height: "100%",
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box
                        className="section-header"
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <FitnessCenter
                          sx={{ mr: 1.5, color: "#667eea", fontSize: 28 }}
                        />
                        <Typography
                          variant="h5"
                          className="section-title"
                          sx={{ fontWeight: 600 }}
                        >
                          Workout Plan
                        </Typography>
                      </Box>
                      <Divider
                        sx={{ mb: 4, borderColor: "#667eea", borderWidth: 1.5 }}
                      />

                      <Box
                        className="workout-instructions"
                        sx={{
                          mb: 4,
                          p: 3,
                          bgcolor: "#f8f9fa",
                          borderRadius: 2,
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        <Typography
                          variant="body1"
                          color="textPrimary"
                          sx={{ fontWeight: 600, mb: 1.5 }}
                        >
                          Format Instructions:
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ mb: 2 }}
                        >
                          Enter one exercise per line. Supported formats:
                        </Typography>
                        <Box
                          component="ul"
                          sx={{ mt: 1, pl: 3, color: "text.secondary" }}
                        >
                          <li style={{ marginBottom: "8px" }}>
                            <code
                              style={{
                                backgroundColor: "#e3f2fd",
                                padding: "4px 8px",
                                borderRadius: "4px",
                              }}
                            >
                              Bench Press | sets: 4 | reps: 8-12
                            </code>
                          </li>
                          <li>
                            <code
                              style={{
                                backgroundColor: "#e3f2fd",
                                padding: "4px 8px",
                                borderRadius: "4px",
                              }}
                            >
                              Squats - 4 - 6-10
                            </code>
                          </li>
                        </Box>
                      </Box>

                      <Stack spacing={2}>
                        {workoutDaysUi.map((d, index) => (
                          <Accordion
                            key={d.dayNumber}
                            defaultExpanded={index === 0}
                          >
                            <AccordionSummary expandIcon={<ExpandMore />}>
                              <Chip
                                label={`Day ${d.dayNumber}`}
                                size="small"
                                color="primary"
                                sx={{ mr: 2 }}
                              />
                              <Typography fontWeight="600">
                                {d.dayName}
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <TextField
                                placeholder="Enter workout exercises..."
                                value={d.text}
                                onChange={(e) =>
                                  updateWorkoutDayText(
                                    d.dayNumber,
                                    e.target.value
                                  )
                                }
                                fullWidth
                                multiline
                                rows={8}
                                className="professional-input workout-input"
                              />
                            </AccordionDetails>
                          </Accordion>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Submit Button */}
              <Divider sx={{ my: 4, borderWidth: 2 }} />
              <Box
                sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 2 }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={submitting}
                  startIcon={<Save />}
                  className="submit-button"
                  sx={{
                    px: 6,
                    py: 2,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    borderRadius: 2,
                    boxShadow: 3,
                    "&:hover": {
                      boxShadow: 6,
                    },
                  }}
                >
                  {submitting ? "Creating Plans..." : "Create & Assign Plans"}
                </Button>
              </Box>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default CreateWorkout;
