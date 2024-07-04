// Workout.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserWorkout.css";

const UserWorkout = () => {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    axios
      .get("/api/workouts")
      .then((response) => {
        setWorkouts(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the workouts!", error);
      });
  }, []);

  return (
    <div className="workout-container">
      {workouts.map((workout, index) => (
        <div className="workout-card" key={index}>
          <h2>{workout.scheduleType}</h2>
          <p>
            <strong>Username:</strong> {workout.Username}
          </p>
          <p>
            <strong>Instructions:</strong> {workout.Instructions}
          </p>
          <p>
            <strong>Day 1 Workout:</strong> {workout.day1workout}
          </p>
          {workout.day2workout && (
            <p>
              <strong>Day 2 Workout:</strong> {workout.day2workout}
            </p>
          )}
          {workout.day3workout && (
            <p>
              <strong>Day 3 Workout:</strong> {workout.day3workout}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserWorkout;
