import LoginForm from "../components/LoginForm";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
    const navigate = useNavigate();

  const [pageLoaded, setPageLoaded] = useState(false);
  const [loginStatus, setLoginStatus] = useState(null); // null, "success", "fail"
  const [shake, setShake] = useState(false); // independent shake state

  // Trigger strips rising after component mounts
  useEffect(() => {
    setPageLoaded(true);
  }, []);

  // Set CSS variable for staggered animation
  useEffect(() => {
    const strips = document.querySelectorAll(".strip");
    strips.forEach(strip => {
      const index = strip.getAttribute("data-index");
      strip.style.setProperty("--i", index);
    });
  }, []);

  // Handle login result from LoginForm
  const handleLoginResult = (success) => {
    if (success) {
      setLoginStatus("success"); // trigger fall
      setTimeout(() => {
        navigate("/header"); // redirect using react-router
      }, 1300); // match animation duration
    } else {
      setShake(true); // trigger shake animation
      setTimeout(() => setShake(false), 500); // reset shake so it can replay next time
    }
  };

  // Determine vertical movement class
  const getStripClass = () => {
    if (loginStatus === "success") return "fall";
    if (pageLoaded) return "rise";
    return "";
  };

  return (
    <div className="background">
      {/* LEFT STRIPS */}
      <div className={`strip strip-l1 ${getStripClass()} ${shake ? "shake" : ""}`} data-index="1"></div>
      <div className={`strip strip-l2 ${getStripClass()} ${shake ? "shake" : ""}`} data-index="2"></div>
      <div className={`strip strip-l3 ${getStripClass()} ${shake ? "shake" : ""}`} data-index="3"></div>
      <div className={`strip strip-l4 ${getStripClass()} ${shake ? "shake" : ""}`} data-index="4"></div>
      <div className={`strip strip-l5 ${getStripClass()} ${shake ? "shake" : ""}`} data-index="5"></div>

      {/* RIGHT STRIPS */}
      <div className={`strip strip-r1 ${getStripClass()} ${shake ? "shake" : ""}`} data-index="1"></div>
      <div className={`strip strip-r2 ${getStripClass()} ${shake ? "shake" : ""}`} data-index="2"></div>
      <div className={`strip strip-r3 ${getStripClass()} ${shake ? "shake" : ""}`} data-index="3"></div>
      <div className={`strip strip-r4 ${getStripClass()} ${shake ? "shake" : ""}`} data-index="4"></div>
      <div className={`strip strip-r5 ${getStripClass()} ${shake ? "shake" : ""}`} data-index="5"></div>

      {/* Login Card */}
      <div className="login-card">
        <h1 className="title">MindMap</h1>
        <p className="subtitle">Sign in to continue</p>
        <LoginForm onLoginResult={handleLoginResult} />
      </div>
    </div>
  );
}