import React from "react";
import "./UserDashboard.css";
import Header from "../Header/HeaderUser";
import heart from "../../assets/heart.png";
import hero_image from "../../assets/hero_image.png";
import hero_image_back from "../../assets/hero_image_back.png";
import Calories from "../../assets/calories.png";
import { useNavigate } from "react-router-dom";
import Programs from "../Programs/Programs";

import { motion } from "framer-motion";

const UserDashboard = () => {
  const navigate = useNavigate();
  const transition = { type: "spring", duration: 1.8 };

  const handleJoinNowClick = () => {
    navigate("/signup");
  };

  return (
    <div>
      <div className="hero">
        <div className="blur hero-blur"></div>
        <div className="left-h">
          <Header />

          {/* The best ad*/}
          <div className="the-best-ad">
            <motion.div
              initial={{ left: "262px" }}
              whileInView={{ left: "6px" }}
              transition={{ ...transition, type: "tween" }}
            ></motion.div>
            <span>The best fitness Club in the town</span>
          </div>

          {/* Hero Heading*/}
          <div className="hero-text">
            <div>
              <span className="stroke-text">Shape</span>
              <span> Your</span>
            </div>
            <div>
              <span>Ideal Body</span>
            </div>
            <div>
              <span>
                In here we will help you to shape and build your ideal body and
                live up your life to fullest
              </span>
            </div>
          </div>

          {/* Figures */}
          <div className="figures">
            <div>
              <span>+140</span>
              <span>expert coaches</span>
            </div>
            <div>
              <span>+978</span>
              <span>members joined</span>
            </div>
            <div>
              <span>+50</span>
              <span>fitness programs</span>
            </div>
          </div>

          {/* Hero buttons */}
          <div className="hero-button">
            <button className="btn">Get Started</button>
            <button className="btn">Learn More</button>
          </div>
        </div>

        <div className="right-h">
          <button className="btn" onClick={handleJoinNowClick}>
            Join Now
          </button>

          {/* Heart rate */}
          <motion.div
            initial={{ right: "-1rem" }}
            whileInView={{ right: "4rem" }}
            transition={transition}
            className="heart-rate"
          >
            <img src={heart} alt="Heart" />
            <span>Heart Rate</span>
            <span>116 bpm</span>
          </motion.div>

          {/* Hero images */}
          <img src={hero_image} alt="" className="hero-image" />

          {/* Hero-back image */}
          <motion.img
            initial={{ right: "20rem" }}
            whileInView={{ right: "30rem" }}
            transition={transition}
            src={hero_image_back}
            alt=""
            className="hero-image-back"
          />

          {/* Calories */}
          <motion.div
            initial={{ right: "39rem" }}
            whileInView={{ right: "32rem" }}
            transition={transition}
            className="calories"
          >
            <img src={Calories} alt="" />
            <div>
              <span>Calories Burned</span>
              <span>220 kcal</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Programs Component */}
      <Programs className="programme"></Programs>
    </div>
  );
};

export default UserDashboard;
