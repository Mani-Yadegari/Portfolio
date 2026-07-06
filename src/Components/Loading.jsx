import React from "react";
import "./Styles/Loading.css";

const Loader = ({ exit }) => {
  return (
    <div className={`loader ${exit ? "exit" : ""}`}>
      <h1 className="loader-title">
        <span>M</span>
        <span>A</span>
        <span>N</span>
        <span>I</span>
      </h1>

      <div className="loader-line"></div>
      <p className="loader-sub">Crafting Digital Experience</p>
    </div>
  );
};

export default Loader;
