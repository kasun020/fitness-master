import React, { useState } from "react";
import "./dashboard.css"; // Import the CSS file

import { AdminDashTable } from "../tables/AdminDashTable.jsx";


function Dashboard() {


  return (
    <div className="dashboard-container">
      <div className="content">
        <AdminDashTable /> 
      </div>
    </div>
  );
}

export default Dashboard;
