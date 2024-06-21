import React from "react";
import Hero from "../Hero";
import Programs from "../Programs/Programs";
import Plans from "../Plans/Plans";
import Footer from "../Footer/Footer";
import "./HomeProgram.css"; // Import the CSS file

function HeroProgramsPage() {
  return (
    <div>
      <div className="component">
        <Hero />
      </div>
      <div className="component">
        <Programs />
      </div>
      <div className="component3">
        <Plans />
      </div>
      <div className="component">
        <Footer />
      </div>
    </div>
  );
}

export default HeroProgramsPage;
