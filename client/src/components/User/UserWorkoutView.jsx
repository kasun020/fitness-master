import { useEffect, useState } from "react";
import { api } from "../../services/api";

const UserWorkoutView = () => {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    api
      .get("/workout-plan/me")
      .then((res) => {
        if (!mounted) return;
        setWorkoutPlan(res.data);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err?.response?.data?.error || err.message);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>My Workout Plan</h2>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!error && !workoutPlan && <p>Loading...</p>}
      {workoutPlan && (
        <div>
          <p>
            <b>Status:</b> {workoutPlan.status}
          </p>
          {workoutPlan.planName && (
            <p>
              <b>Plan:</b> {workoutPlan.planName}
            </p>
          )}
          {workoutPlan.scheduleType && (
            <p>
              <b>Schedule type:</b> {workoutPlan.scheduleType}
            </p>
          )}
          {workoutPlan.generalInstructions && (
            <p>
              <b>Instructions:</b> {workoutPlan.generalInstructions}
            </p>
          )}

          <h3>Workout Days</h3>
          {workoutPlan.workoutDays?.length ? (
            <ul>
              {workoutPlan.workoutDays.map((day, idx) => (
                <li key={idx}>
                  <b>
                    Day {day.dayNumber}
                    {day.dayName ? ` - ${day.dayName}` : ""}
                  </b>
                  {day.exercises?.length ? (
                    <ul>
                      {day.exercises.map((ex, exIdx) => (
                        <li key={exIdx}>
                          {ex.name}
                          {ex.sets != null ? ` | sets: ${ex.sets}` : ""}
                          {ex.reps ? ` | reps: ${ex.reps}` : ""}
                          {ex.restSeconds != null
                            ? ` | rest: ${ex.restSeconds}s`
                            : ""}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div>No exercises listed.</div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No workout days listed.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default UserWorkoutView;
