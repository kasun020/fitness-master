import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const handleMyPlansClick = () => {
    navigate("/my-plans");
  };

  return (
    <div className="header">
      <img src={Logo} alt="" className="logo" />

      <ul className="header-menu">
        <li>Home</li>
        <li>Programs</li>
        <li>Why</li>
        <li>Plans</li>
        <li>Testimonials</li>
        {isLoggedIn && (
          <li
            onClick={handleMyPlansClick}
            style={{
              cursor: "pointer",
              color: "var(--orange)",
              fontWeight: "bold",
            }}
          >
            My Plans
          </li>
        )}
      </ul>
    </div>
  );
};

export default Header;
