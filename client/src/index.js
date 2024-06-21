import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "../src/App.js";
import { BrowserRouter, Router, Route } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
