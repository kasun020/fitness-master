import { useEffect, useState } from "react";
import { api } from "../../services/api";

const UserDietView = () => {
  const [dietPlan, setDietPlan] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    api
      .get("/diet-plan/me")
      .then((res) => {
        if (!mounted) return;
        setDietPlan(res.data);
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
      <h2>My Diet Plan</h2>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!error && !dietPlan && <p>Loading...</p>}
      {dietPlan && (
        <div>
          <p>
            <b>Status:</b> {dietPlan.status}
          </p>
          {dietPlan.dailyCalories != null && (
            <p>
              <b>Daily calories:</b> {dietPlan.dailyCalories}
            </p>
          )}
          {dietPlan.generalNotes && (
            <p>
              <b>Notes:</b> {dietPlan.generalNotes}
            </p>
          )}

          <h3>Meals</h3>
          {dietPlan.meals?.length ? (
            <ul>
              {dietPlan.meals.map((meal, idx) => (
                <li key={idx}>
                  <b>{meal.mealType || "Meal"}</b>
                  {meal.time ? ` (${meal.time})` : ""}
                  {meal.foods?.length ? (
                    <ul>
                      {meal.foods.map((food, fIdx) => (
                        <li key={fIdx}>
                          {food.name}{" "}
                          {food.quantity ? `- ${food.quantity}` : ""}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {meal.notes ? <div>{meal.notes}</div> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p>No meals listed.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDietView;
