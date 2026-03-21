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
  const handleLoginResult = (result) => {
    if (loginStatus === "success") return;
    
    if (result.success) {
      setLoginStatus("success"); // trigger fall animation
      setTimeout(() => {
        // You can pass user info via state or context if needed
        navigate("/header", { state: { root_card_id: result.user.root_card_id, user_id: result.user.user_id } });
      }, 1300); 
    } else {
      setShake(true); // trigger shake animation
      setTimeout(() => setShake(false), 500); 
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
      {["l1","l2","l3","l4","l5"].map((cls,i) => (
        <div key={cls} className={`strip strip-${cls} ${getStripClass()} ${shake ? "shake" : ""}`} data-index={i+1}></div>
      ))}

      {/* RIGHT STRIPS */}
      {["r1","r2","r3","r4","r5"].map((cls,i) => (
        <div key={cls} className={`strip strip-${cls} ${getStripClass()} ${shake ? "shake" : ""}`} data-index={i+1}></div>
      ))}
      
      {/* Login Card */}
      <div className="login-card">
        <h1 className="title">MindMap</h1>
        <p className="subtitle">Sign in to continue</p>
        <LoginForm onLoginResult={handleLoginResult} />
      </div>
    </div>
  );
}