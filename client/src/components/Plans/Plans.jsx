import { useNavigate } from "react-router-dom";
import whiteTick from "../../assets/whiteTick.png";
import { plansData } from "../../data/plansData";
import "./Plans.css";

const Plan = () => {
  const navigate = useNavigate();
  const handleJoinNowClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    navigate("/registration");
  };
  return (
    <div className="plans-container">
      <div className="blur plans-blur-1"></div>
      <div className="blur plans-blur-2"></div>
      <div className="programs-header" style={{ gap: "2rem" }}>
        <span className="stroke-text">READY TO START</span>
        <span>YOUR JOURNEY</span>
        <span className="stroke-text">NOW WITHUS</span>
      </div>

      {/* plans card */}
      <div className="plans">
        {plansData.map((plan, i) => (
          <div className="plan" key={i}>
            {plan.icon}
            <span>{plan.name}</span>
            <span>LKR {plan.price} </span>

            <div className="features">
              {plan.features.map((feature, i) => (
                <div className="feature">
                  <img src={whiteTick} alt="" />
                  <span key={i}>{feature}</span>
                </div>
              ))}
            </div>
            <div>
              <span>See more benefits</span>
            </div>
            <button className="btn" onClick={handleJoinNowClick}>
              Join Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plan;
