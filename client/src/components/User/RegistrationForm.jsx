import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "./RegistrationForm.css";

const RegistrationForm = () => {
  const [scheduleType, setScheduleType] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [paymentSlip, setPaymentSlip] = useState(null);
  const [frontBodyPicture, setFrontBodyPicture] = useState(null);
  const [backBodyPicture, setBackBodyPicture] = useState(null);

  const navigate = useNavigate();

  const sendData = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("scheduleType", scheduleType);
    formData.append("name", name);
    formData.append("age", age);
    formData.append("gender", gender);
    formData.append("weight", weight);
    formData.append("whatsappNumber", whatsappNumber);
    formData.append("paymentSlip", paymentSlip);
    formData.append("frontBodyPicture", frontBodyPicture);
    formData.append("backBodyPicture", backBodyPicture);

    try {
      const res = await axios.post('http://localhost:5000/register/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="registration-form-container">
      <h2>Registration Form</h2>
      <form onSubmit={sendData}>
        <div className="form-group">
          <label>Schedule Type:</label>
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
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Age:</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Gender:</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div className="form-group">
          <label>Weight:</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Whatsapp Number:</label>
          <input
            type="text"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Payment Slip:</label>
          <input
            type="file"
            onChange={(e) => setPaymentSlip(e.target.files[0])}
            required
          />
        </div>
        <div className="form-group">
          <label>Front Body Picture:</label>
          <input
            type="file"
            onChange={(e) => setFrontBodyPicture(e.target.files[0])}
            required
          />
        </div>
        <div className="form-group">
          <label>Back Body Picture:</label>
          <input
            type="file"
            onChange={(e) => setBackBodyPicture(e.target.files[0])}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default RegistrationForm;
