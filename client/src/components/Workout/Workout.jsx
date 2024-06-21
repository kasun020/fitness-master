import React from "react";
import "./Workout.css";
import { programsData } from "../../data/workoutData";
import axios from "axios";
import { useState } from "react";

const Workout = () => {
  const [formData, setFormData] = useState({
    exercise: "",
    sets: "",
    count: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/workouts",
        formData
      );
      console.log(response.data); // Log the response from backend
      // Optionally, reset the form
      setFormData({ exercise: "", sets: "", count: "" });
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div className="programs" id="programs">
      {/* header */}
      <div className="programs-header">
        <span>WORKOUT</span>
      </div>

      <div className="program-categories" onSubmit={handleSubmit}>
        {programsData.map((program) => (
          <div className="category" key={program.heading}>
            {program.image}
            <span>{program.heading}</span>
            <div className="form-group">
              <div className="form-row">
                <select>
                  <option value="">Select Exercise</option>
                  <option value="Bench press">{program.heading1}</option>
                  <option value="Dumbbell Flyes">{program.heading2}</option>
                  <option value="Push up">{program.heading3}</option>
                  <option value="Incline DB press">{program.heading4}</option>
                  <option value="DB bench press">{program.heading5}</option>
                </select>
                <input type="number" placeholder="Sets" />
                <input type="number" placeholder="Count" />
              </div>

              <div className="form-row">
                <select>
                  <option value=""> Select Exercise </option>
                  <option value="Stair Climbing">{program.heading1}</option>
                  <option value="Cycling">{program.heading2}</option>
                  <option value="Treadmill">{program.heading3}</option>
                  <option value="Leg Raise">{program.heading4}</option>
                  <option value="Reverse Crunch">{program.heading5}</option>
                </select>
                <input type="number" placeholder="Sets" />
                <input type="number" placeholder="Count" />
              </div>
              <div className="form-row">
                <select>
                  <option value=""> Select Exercise </option>
                  <option value="Bench press">{program.heading1}</option>
                  <option value="Dumbbell Flyes">{program.heading2}</option>
                  <option value="Push up">{program.heading3}</option>
                  <option value="Incline DB press">{program.heading4}</option>
                  <option value="DB bench press">{program.heading5}</option>
                </select>
                <input type="number" placeholder="Sets" />
                <input type="number" placeholder="Count" />
              </div>
              <div className="form-row">
                <select>
                  <option value=""> Select Exercise</option>
                  <option value="Squat">{program.heading1}</option>
                  <option value="Lunges">{program.heading2}</option>
                  <option value="Leg Curl">{program.heading3}</option>
                  <option value="Leg Extention">{program.heading4}</option>
                  <option value="Calf">{program.heading5}</option>
                </select>
                <input type="number" placeholder="Sets" />
                <input type="number" placeholder="Count" />
              </div>
              <div className="form-row">
                <select>
                  <option value=""> Select Exercise </option>
                  <option value="Bicep Curl">{program.heading1}</option>
                  <option value="Hammer Curl">{program.heading2}</option>
                  <option value="Ez Curl">{program.heading3}</option>
                  <option value="DB Curl">{program.heading4}</option>
                  <option value="Barbell Curl">{program.heading5}</option>
                </select>
                <input type="number" placeholder="Sets" />
                <input type="number" placeholder="Count" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="submit-button-container">
        <button className="submit-button">Submit</button>
      </div>
    </div>
  );
};

export default Workout;
