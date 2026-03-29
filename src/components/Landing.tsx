import { PropsWithChildren } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              ZOWRAYS
              <br />
              <span>HASSAN</span>
            </h1>
          </div>
          <div className="landing-info">
            <h3>Based in Pakistan</h3>
            <div className="landing-info-h2">
              <h2 className="landing-h2-1">FULL-STACK</h2>
              <h2 className="landing-h2-2">SAAS</h2>
              <h2 className="landing-h2-3">CREATOR</h2>
            </div>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
