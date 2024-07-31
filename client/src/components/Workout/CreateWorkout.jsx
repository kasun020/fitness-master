import React, { useState } from "react";
import axios from "axios";
import "./createWorkout.css";

import { useGlobalContext } from "../../contexts/GlobalContext";

const CreateWorkout = () => {

  const {
    getAll,
  } = useGlobalContext();

  const [scheduleType, setScheduleType] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [day1workout, setDay1workout] = useState("");
  const [day2workout, setDay2workout] = useState("");
  const [day3workout, setDay3workout] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();


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

  return (
    <div className="create-workout-form-container">
      <h2>WORKOUT</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group-row">
          <div className="form-item-1">
            <label style={{ marginLeft: "1rem" }}>Schedule Type:</label>
            <select
              className="custom-select"
              value={scheduleType}
              onChange={(e) => setScheduleType(e.target.value)}
              required
            >
              <option value="">Select Schedule Type</option>
              <option value="Body Building">Body Building</option>
              <option value="Fat Burning">Fat Burning</option>
              <option value="Ladies">Ladies</option>
            </select>
          </div>

          <div className="form-item-2">
            <label style={{ marginLeft: "1rem" }}>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="desc">
          <label>Instructions</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="workout-form-container">
          <div className="workout-row">
            <div className="workoutd1">
              <label style={{ marginLeft: "0.5rem" }}>Day 01</label>
              <textarea
                placeholder="Enter workout details..."
                value={day1workout}
                onChange={(e) => setDay1workout(e.target.value)}
              ></textarea>
            </div>
            <div className="workoutd2">
              <label style={{ marginLeft: "0.5rem" }}>Day 02</label>
              <textarea
                placeholder="Enter workout details..."
                value={day2workout}
                onChange={(e) => setDay2workout(e.target.value)}
              ></textarea>
            </div>
            <div className="workoutd3">
              <label style={{ marginLeft: "0.5rem" }}>Day 03</label>
              <textarea
                placeholder="Enter workout details..."
                value={day3workout}
                onChange={(e) => setDay3workout(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="submit-button"
          style={{ marginLeft: "1rem" }}
        >
          Submit
        </button>
      </form>
      <button onClick={() => getAll()}>click me</button>
    </div>
  );
};

export default CreateWorkout;
