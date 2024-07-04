import React from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login/Login";
import SignUp from "./components/Signup/Signup";
import Dashboard from "./components/Dashboard/Dashboard";
import RegistrationForm from "./components/User/RegistrationForm";
import HomeProgram from "./components/Pages/HomeProgram";
import UserDashboard from "./components/Dashboard/UserDashboard.jsx";

import { GlobalProvider } from "./contexts/GlobalContext.jsx";

const isAdmin = localStorage.getItem("role") === "admin";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomeProgram />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/registration" element={<RegistrationForm />} />
        <Route path="/UserDashboard" element={<UserDashboard />} />

        {/* Conditionally render the Dashboard route */}
        {isAdmin ? (
          <Route path="/dashboard" element={<GlobalProvider><Dashboard /></GlobalProvider>} />
        ) : (
          // Redirect to login page if not admin
          <Route path="/dashboard" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
