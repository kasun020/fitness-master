import "./Dashboard.css";

import { AdminDashTable } from "../tables/AdminDashTable.jsx";

function RejectedDashboard() {
  return (
    <div className="dashboard-container">
      <div className="content">
        <AdminDashTable view="rejected" />
      </div>
    </div>
  );
}

export default RejectedDashboard;
