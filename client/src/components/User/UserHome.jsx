import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";

const UserHome = () => {
  const [registration, setRegistration] = useState(null);
  const [registrationError, setRegistrationError] = useState(null);

  useEffect(() => {
    let mounted = true;

    api
      .get("/register/me")
      .then((res) => {
        if (!mounted) return;
        setRegistration(res.data);
      })
      .catch((err) => {
        if (!mounted) return;
        if (err?.response?.status === 404) {
          setRegistration(null);
          setRegistrationError(null);
          return;
        }
        setRegistrationError(err?.response?.data?.error || err.message);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>My Dashboard</h2>

      {!registration && !registrationError && (
        <div>
          <p>You have not submitted your details yet.</p>
          <Link to="/registration">Go to Registration Form</Link>
        </div>
      )}

      {registrationError && (
        <p style={{ color: "red" }}>Error: {registrationError}</p>
      )}

      {registration && (
        <div>
          <p>
            <b>Status:</b> {registration.status}
          </p>
          {registration.adminNotes && (
            <p>
              <b>Admin notes:</b> {registration.adminNotes}
            </p>
          )}

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link to="/diet">View Diet Plan</Link>
            <Link to="/workout">View Workout Plan</Link>
            <Link to="/notifications">Notifications</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserHome;
