import React, { useEffect, useState } from "react";
import "./createWorkout.css";

import { useParams } from "react-router-dom";
import { useGlobalContext } from "../../contexts/GlobalContext";

import { Buffer } from "buffer";

const CreateWorkout = () => {
  const { id } = useParams();

  const { users } = useGlobalContext();

  const [scheduleType, setScheduleType] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("");
  const [description, setDescription] = useState("");
  const [day1workout, setDay1workout] = useState("");
  const [day2workout, setDay2workout] = useState("");
  const [day3workout, setDay3workout] = useState("");
  const [frontImage, setFrontImage] = useState();
  const [backImage, setBackImage] = useState();
  const [paymentSlip, setPaymentSlip] = useState();

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

  useEffect(() => {
    const foundUser = users.data.find((user) => user._id === id);
    if (foundUser) {
      setName(foundUser.name);
      setAge(foundUser.age);
      setWeight(foundUser.weight);
      setGender(foundUser.gender);
      setScheduleType(foundUser.scheduleType); // Set the schedule type from user data

      const paymentSlipBase64 = Buffer.from(
        foundUser.paymentSlip.img.data
      ).toString("base64");
      const paymentSlipSrc = `data:${foundUser.paymentSlip.img.contentType};base64,${paymentSlipBase64}`;
      setPaymentSlip(paymentSlipSrc);

      const frontBase64 = Buffer.from(
        foundUser.frontBodyPicture.img.data
      ).toString("base64");
      const frontSrc = `data:${foundUser.frontBodyPicture.img.contentType};base64,${frontBase64}`;
      setFrontImage(frontSrc);

      const backBase64 = Buffer.from(
        foundUser.backBodyPicture.img.data
      ).toString("base64");
      const backSrc = `data:${foundUser.backBodyPicture.img.contentType};base64,${backBase64}`;
      setBackImage(backSrc);
    }
  }, []);

  return (
    <div className="create-workout-form-container">
      <h2>WORKOUT</h2>
      <section className="personal-section">
        <h3>Personal Information</h3>
        <div className="personal">
          <label style={{ marginLeft: "1rem" }}>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={true}
          />
        </div>
        <div className="personal">
          <label style={{ marginLeft: "1rem" }}>Age:</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            disabled={true}
          />
        </div>
        <div className="personal">
          <label style={{ marginLeft: "1rem" }}>Gender:</label>
          <input
            type="number"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            disabled={true}
          />
        </div>
        <div className="personal">
          <label style={{ marginLeft: "1rem" }}>Weight:(kg):</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            disabled={true}
          />
        </div>
      </section>
      <section className="workout">
        <div className="workout">
          <label htmlFor=""></label>
          <input type="text" />
        </div>
      </section>
      <form onSubmit={handleSubmit}>
        <div className="form-group-row">
          <div className="form-item-1">
            <label style={{ marginLeft: "1rem" }}>Schedule Type:</label>
            <select
              className="custom-select"
              value={scheduleType}
              onChange={(e) => setScheduleType(e.target.value)}
              disabled={true}
            >
              <option value="">Select Schedule Type</option>
              <option value="Body Building">Body Building</option>
              <option value="Fat Burning">Fat Burning</option>
              <option value="Ladies">Ladies</option>
            </select>
          </div>

          <div className="form-item-3">
            <label style={{ marginLeft: "1rem" }}>Payment Slip:</label>
            {paymentSlip && (
              <img
                src={paymentSlip}
                alt="payment-slip"
                style={{ height: "250px", width: "250px" }}
              />
            )}
          </div>
          <div className="form-item-4">
            <label style={{ marginLeft: "1rem" }}>Front Image:</label>
            {frontImage && (
              <img
                src={frontImage}
                alt="payment-slip"
                style={{ height: "250px", width: "250px" }}
              />
            )}
          </div>
          <div className="form-item-5">
            <label style={{ marginLeft: "1rem" }}>Back Image:</label>
            {backImage && (
              <img
                src={backImage}
                alt="payment-slip"
                style={{ height: "250px", width: "250px" }}
              />
            )}
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
    </div>
  );
};

export default CreateWorkout;
