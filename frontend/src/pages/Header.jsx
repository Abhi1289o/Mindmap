// src/pages/Header.jsx
import GlassCard from "../components/GlassCard";
import "../styles/global.css";

export default function Header() {
  return (
    <div className="page-container">
      <GlassCard
        id="main-card2"
        defaultContent={`
          <h1>Welcome to MindMap!</h1>
          <p>You have successfully logged in.</p>
          <p>Edit this dashboard card...</p>
        `}
      />
    </div>
  );
}