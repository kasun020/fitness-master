import React, { useState } from "react";
import DataTable from "react-data-table-component";
import Programs from "../Programs/Programs";
import Workout from "../Workout/Workout.jsx";
import "./Dashboard.css"; // Import the CSS file

function App() {
  const [activeSection, setActiveSection] = useState("Home"); // State to manage the active section

  const handleSidebarClick = (item) => {
    setActiveSection(item);
  };

  const columns = [
    {
      name: "Schedule Type",
      selector: (row) => row.name,
      sortable: true,
      width: "15rem",
      grow: 2, // Increase the size of the first column
      center: true, // Center the column data
      cell: (row) => <div className="table-cell">{row.name}</div>, // Apply CSS class
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      width: "10rem", // Set fixed width to avoid misalignment
      center: true, // Center the column data
      cell: (row) => <div className="table-cell">{row.name}</div>, // Apply CSS class
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      cell: (row) => <div className="table-cell">{row.email}</div>, // Apply CSS class
    },
    {
      name: "Age",
      selector: (row) => row.age,
      sortable: true,
      width: "7rem", // Set fixed width to avoid misalignment
      cell: (row) => <div className="table-cell">{row.age}</div>, // Apply CSS class
    },
    {
      name: "Gender",
      selector: (row) => row.gender,
      sortable: true,
      center: true, // Center the column data
      cell: (row) => <div className="table-cell">{row.gender}</div>, // Apply CSS class
    },
    {
      name: "Weight(KG)",
      selector: (row) => row.weight,
      sortable: true,
      center: true, // Center the column data
      cell: (row) => <div className="table-cell">{row.weight}</div>, // Apply CSS class
    },
    {
      name: "Payment Slip",
      selector: (row) => row.payment,
      sortable: true,
      center: true, // Center the column data
      cell: (row) => <div className="table-cell">{row.payment}</div>, // Apply CSS class
    },
    {
      name: "Workout",
      selector: (row) => row.workout,
      sortable: true,
      center: true, // Center the column data
      cell: (row) => <div className="table-cell">{row.workout}</div>, // Apply CSS class
    },
  ];

  const data = [
    {
      id: 1,
      name: "John Doe",
      email: "john@gmail.com",
      age: "25",
      gender: "Male",
      weight: "70",
      payment: "Paid",
      workout: "Yes",
    },
    {
      id: 2,
      name: "John David",
      email: "johnDavid@gmail.com",
      age: "25",
    },
    {
      id: 3,
      name: "John Boult",
      email: "johnB@gmail.com",
      age: "25",
    },
  ];

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>Dashboard</h2>
        <ul>
          <li onClick={() => handleSidebarClick("Home")}>Home</li>
          <li onClick={() => handleSidebarClick("Users")}>Users</li>
          <li onClick={() => handleSidebarClick("workouts")}>Workouts</li>
        </ul>
      </div>
      <div className="content">
        <div className="container mt-5">
          {activeSection === "Users" && (
            <>
              <h1 className="table-title">User details</h1>
              <DataTable
                className="custom-table" // Add a custom class for styling
                columns={columns}
                data={data}
                selectableRows
                fixedHeader
                customStyles={customStyles} // Apply custom styles
                responsive={true} // Make the table responsive
              />
            </>
          )}
          {activeSection === "workouts" && (
            <div className="workout-section">
              {" "}
              {/* Add a CSS class for styling */}
              <Workout /> {/* Render the Programs component */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const customStyles = {
  table: {
    style: {
      width: "96%", // Set the width of the table to 100% of its container
      borderRadius: "1rem", // Rounded corners for the table
      border: "2px solid rgba(0, 0, 0, 0.1)", // Optional: Add a border
    },
  },
  header: {
    style: {
      fontSize: "16px", // Increased font size
      textAlign: "center", // Center the column headers
      borderRadius: "1rem", // Rounded corners for the header
    },
  },
  headRow: {
    style: {
      fontSize: "16px", // Increased font size
      textAlign: "center", // Center the column headers
      justifyContent: "center", // Center the content
      alignItems: "center", // Center the content vertically
      borderRadius: "1rem", // Rounded corners for the header
    },
  },
  headCells: {
    style: {
      fontSize: "20px", // Increased font size
      fontWeight: "bold",
      textAlign: "center", // Center the column headers
      justifyContent: "center", // Center the content
      alignItems: "center", // Center the content vertically
    },
  },
  cells: {
    style: {
      fontSize: "18px", // Increased font size for rows
      textAlign: "center", // Center the column data
      justifyContent: "center", // Center the content
      alignItems: "center", // Center the content vertically
      backgroundColor: "rgba(54, 48, 35, 0.4)", // Background color for table cells
      color: "white", // Set font color to white
      borderRadius: "2rem", // Rounded corners for the cells
      padding: "0.8rem", // Add padding to cells
    },
  },
  rows: {
    style: {
      justifyContent: "center", // Center the content
      alignItems: "center", // Center the content vertically
      backgroundColor: "rgba(54, 48, 35, 0.4)", // Background color for table rows
      padding: "0.3rem", // Add padding to rows
    },
  },
};

export default App;
