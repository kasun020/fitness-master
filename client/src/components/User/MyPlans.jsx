import { CalendarMonth, FitnessCenter, Restaurant } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import "./MyPlans.css";

const MyPlans = () => {
  const [tabValue, setTabValue] = useState(0);
  const [dietPlan, setDietPlan] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [dietError, setDietError] = useState(null);
  const [workoutError, setWorkoutError] = useState(null);
  const [loadingPlans, setLoadingPlans] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoadingPlans(true);
    setDietError(null);
    setWorkoutError(null);

    const dietReq = api
      .get("/diet-plan/me")
      .then((res) => {
        if (!mounted) return;
        setDietPlan(res.data);
      })
      .catch((err) => {
        if (!mounted) return;
        if (err?.response?.status === 404) {
          setDietPlan(null);
          return;
        }
        setDietError(err?.response?.data?.error || err.message);
      });

    const workoutReq = api
      .get("/workout-plan/me")
      .then((res) => {
        if (!mounted) return;
        setWorkoutPlan(res.data);
      })
      .catch((err) => {
        if (!mounted) return;
        if (err?.response?.status === 404) {
          setWorkoutPlan(null);
          return;
        }
        setWorkoutError(err?.response?.data?.error || err.message);
      });

    Promise.allSettled([dietReq, workoutReq]).finally(() => {
      if (!mounted) return;
      setLoadingPlans(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="my-plans-container">
      <Container maxWidth="lg">
        <Box className="my-plans-header">
          <Box className="plans-icon-wrapper">
            <FitnessCenter className="plans-icon" />
          </Box>
          <Box className="plans-text-content">
            <Typography variant="h3" className="plans-title">
              My Fitness Plans
            </Typography>
            <Typography variant="body1" className="plans-subtitle">
              View your personalized diet and workout plans
            </Typography>
          </Box>
        </Box>

        <Card className="plans-card" elevation={8}>
          <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
            <Tabs
              value={tabValue}
              onChange={(_, v) => setTabValue(v)}
              variant="fullWidth"
              indicatorColor="primary"
              sx={{
                mb: 4,
                "& .MuiTab-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  textTransform: "none",
                  py: 2,
                },
                "& .Mui-selected": {
                  color: "var(--orange) !important",
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "var(--orange)",
                  height: 3,
                },
              }}
            >
              <Tab
                icon={<Restaurant />}
                iconPosition="start"
                label="Diet Plan"
              />
              <Tab
                icon={<FitnessCenter />}
                iconPosition="start"
                label="Workout Plan"
              />
            </Tabs>

            {loadingPlans && (
              <Box className="loading-container">
                <CircularProgress size={50} sx={{ color: "var(--orange)" }} />
                <Typography sx={{ color: "white", mt: 2, fontSize: "1.1rem" }}>
                  Loading your plans...
                </Typography>
              </Box>
            )}

            {!loadingPlans && tabValue === 0 && (
              <Box>
                {dietError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {dietError}
                  </Alert>
                )}

                {!dietError && !dietPlan && (
                  <Box className="no-plan-container">
                    <Restaurant
                      sx={{ fontSize: 80, color: "var(--orange)", mb: 2 }}
                    />
                    <Typography variant="h5" sx={{ color: "white", mb: 2 }}>
                      No Diet Plan Assigned Yet
                    </Typography>
                    <Typography
                      sx={{ color: "rgba(255, 255, 255, 0.7)", mb: 3 }}
                    >
                      Submit your details to get a personalized diet plan from
                      our experts
                    </Typography>
                    <Stack direction="row" spacing={2} justifyContent="center">
                      <Button
                        component={Link}
                        to="/registration"
                        variant="contained"
                        size="large"
                        startIcon={<CalendarMonth />}
                        sx={{
                          backgroundColor: "var(--orange)",
                          "&:hover": { backgroundColor: "#e87d0d" },
                        }}
                      >
                        Submit Details
                      </Button>
                      <Button
                        component={Link}
                        to="/diet"
                        variant="outlined"
                        size="large"
                        sx={{
                          color: "white",
                          borderColor: "white",
                          "&:hover": {
                            borderColor: "var(--orange)",
                            color: "var(--orange)",
                          },
                        }}
                      >
                        View All Diets
                      </Button>
                    </Stack>
                  </Box>
                )}

                {dietPlan && (
                  <Box>
                    {dietPlan.dailyCalories != null && (
                      <Box sx={{ mb: 3 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: "white",
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <span style={{ color: "var(--orange)" }}>
                            Daily Calories:
                          </span>
                          {dietPlan.dailyCalories} kcal
                        </Typography>
                      </Box>
                    )}

                    {dietPlan.generalNotes && (
                      <Paper
                        className="notes-card"
                        elevation={2}
                        sx={{ mb: 3 }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ mb: 1, fontWeight: 700 }}
                        >
                          General Notes
                        </Typography>
                        <Typography
                          sx={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}
                        >
                          {dietPlan.generalNotes}
                        </Typography>
                      </Paper>
                    )}

                    <Box>
                      <Typography
                        variant="h5"
                        sx={{
                          color: "white",
                          mb: 3,
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Restaurant sx={{ mr: 1, color: "var(--orange)" }} />
                        Your Meals
                      </Typography>
                      {dietPlan.meals?.length ? (
                        <Grid container spacing={3}>
                          {dietPlan.meals.map((meal, idx) => (
                            <Grid item xs={12} md={6} key={idx}>
                              <Paper className="meal-card" elevation={4}>
                                <Box className="meal-header">
                                  <Typography variant="h6" fontWeight={700}>
                                    {meal.mealType || "Meal"}
                                  </Typography>
                                  {meal.time && (
                                    <Typography className="meal-time">
                                      {meal.time}
                                    </Typography>
                                  )}
                                </Box>
                                {meal.notes && (
                                  <Typography
                                    sx={{
                                      whiteSpace: "pre-wrap",
                                      mt: 2,
                                      lineHeight: 1.8,
                                    }}
                                  >
                                    {meal.notes}
                                  </Typography>
                                )}
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>
                      ) : (
                        <Typography sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                          No meals listed in your plan yet.
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
              </Box>
            )}

            {!loadingPlans && tabValue === 1 && (
              <Box>
                {workoutError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {workoutError}
                  </Alert>
                )}

                {!workoutError && !workoutPlan && (
                  <Box className="no-plan-container">
                    <FitnessCenter
                      sx={{ fontSize: 80, color: "var(--orange)", mb: 2 }}
                    />
                    <Typography variant="h5" sx={{ color: "white", mb: 2 }}>
                      No Workout Plan Assigned Yet
                    </Typography>
                    <Typography
                      sx={{ color: "rgba(255, 255, 255, 0.7)", mb: 3 }}
                    >
                      Submit your details to get a personalized workout plan
                      from our experts
                    </Typography>
                    <Stack direction="row" spacing={2} justifyContent="center">
                      <Button
                        component={Link}
                        to="/registration"
                        variant="contained"
                        size="large"
                        startIcon={<CalendarMonth />}
                        sx={{
                          backgroundColor: "var(--orange)",
                          "&:hover": { backgroundColor: "#e87d0d" },
                        }}
                      >
                        Submit Details
                      </Button>
                      <Button
                        component={Link}
                        to="/workout"
                        variant="outlined"
                        size="large"
                        sx={{
                          color: "white",
                          borderColor: "white",
                          "&:hover": {
                            borderColor: "var(--orange)",
                            color: "var(--orange)",
                          },
                        }}
                      >
                        View All Workouts
                      </Button>
                    </Stack>
                  </Box>
                )}

                {workoutPlan && (
                  <Box>
                    {workoutPlan.scheduleType && (
                      <Box sx={{ mb: 3 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: "white",
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <span style={{ color: "var(--orange)" }}>
                            Schedule Type:
                          </span>
                          {workoutPlan.scheduleType}
                        </Typography>
                      </Box>
                    )}

                    {workoutPlan.generalInstructions && (
                      <Paper
                        className="notes-card"
                        elevation={2}
                        sx={{ mb: 3 }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ mb: 1, fontWeight: 700 }}
                        >
                          General Instructions
                        </Typography>
                        <Typography
                          sx={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}
                        >
                          {workoutPlan.generalInstructions}
                        </Typography>
                      </Paper>
                    )}

                    <Box>
                      <Typography
                        variant="h5"
                        sx={{
                          color: "white",
                          mb: 3,
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <FitnessCenter sx={{ mr: 1, color: "var(--orange)" }} />
                        Workout Days
                      </Typography>
                      {workoutPlan.workoutDays?.length ? (
                        <Grid container spacing={3}>
                          {workoutPlan.workoutDays.map((day, idx) => (
                            <Grid item xs={12} md={6} key={idx}>
                              <Paper className="workout-day-card" elevation={4}>
                                <Box className="workout-day-header">
                                  <Typography variant="h6" fontWeight={700}>
                                    Day {day.dayNumber}
                                  </Typography>
                                  {day.dayName && (
                                    <Typography className="day-name">
                                      {day.dayName}
                                    </Typography>
                                  )}
                                </Box>
                                {day.exercises?.length ? (
                                  <Box className="exercises-list">
                                    {day.exercises.map((ex, exIdx) => (
                                      <Box
                                        key={exIdx}
                                        className="exercise-item"
                                      >
                                        <Typography fontWeight={600}>
                                          {ex.name}
                                        </Typography>
                                        <Box className="exercise-details">
                                          {ex.sets != null && (
                                            <Typography className="exercise-stat">
                                              Sets: {ex.sets}
                                            </Typography>
                                          )}
                                          {ex.reps && (
                                            <Typography className="exercise-stat">
                                              Reps: {ex.reps}
                                            </Typography>
                                          )}
                                        </Box>
                                      </Box>
                                    ))}
                                  </Box>
                                ) : (
                                  <Typography sx={{ mt: 2 }}>
                                    No exercises listed.
                                  </Typography>
                                )}
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>
                      ) : (
                        <Typography sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                          No workout days listed in your plan yet.
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default MyPlans;
