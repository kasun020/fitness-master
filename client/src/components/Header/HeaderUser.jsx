import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png";
import "./HeaderUser.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem("token")));
  }, [location.pathname]);

  const handleAuthClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="header">
      <img src={Logo} alt="" className="logo" />
      <nav>
        <ul className="header-menu">
          <li>
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li style={{ color: "white" }}>
            <Link to="/workout" className="nav-link">
              Workout
            </Link>
          </li>
          <li>
            <Link to="/plans" className="nav-link">
              Plans
            </Link>
          </li>
          <li>
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
          </li>

          <li
            style={{ color: "white", cursor: "pointer" }}
            onClick={handleAuthClick}
          >
            {isLoggedIn ? "Logout" : "Login"}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
