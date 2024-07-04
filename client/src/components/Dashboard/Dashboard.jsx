import React, { useState } from "react";
import "./dashboard.css"; // Import the CSS file

import { AdminDashTable } from "../tables/AdminDashTable.jsx";
import CreateWorkout from "../Workout/CreateWorkout.jsx";

import { useGlobalContext } from "../../contexts/GlobalContext.jsx";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'


function Dashboard() {

  const [ toggleNav, setToggleNav ] = useState(false);

  const {
    activeSection,
    handleSidebarClick,
  } = useGlobalContext();

  const toggleSideNav = () => {
    setToggleNav(!toggleNav);
  }

  return (
    <div className="dashboard-container">
      <div className="toggle-icon" onClick={toggleSideNav}>
        <FontAwesomeIcon icon={faBars} />
      </div>
      <div className={`sidebar ${toggleNav ? 'active' : ''}`}>
        <h2>Dashboard</h2>
        <FontAwesomeIcon icon={faXmark} onClick={toggleSideNav} style={{position: 'absolute', top: '10px', right: '10px'}}/>
        <ul>
          <li onClick={() => handleSidebarClick("Home")}>Home</li>
          <li onClick={() => handleSidebarClick("Users")}>Users</li>
          <li onClick={() => handleSidebarClick("workouts")}>Workouts</li>
        </ul>
      </div>
      <div className="content">
        {activeSection === "workouts" && (
                <div className="workout-section">
                {" "}
                {/* Add a CSS class for styling */}
                <CreateWorkout /> {/* Render the Programs component */}
                </div>
          )}
        {activeSection === "Users" && (
            <AdminDashTable />
          )}
      </div>
    </div>
  );
}

export default Dashboard;
