import React from "react";
import "./HeaderUser.css";
import Logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

const Header = () => {
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
        </ul>
      </nav>
    </div>
  );
};

export default Header;
