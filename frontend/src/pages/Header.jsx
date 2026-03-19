// src/pages/Header.jsx
import GlassCard from "../components/GlassCard";
import "../styles/global.css";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const rootCardId = location.state?.root_card_id;

  return (
    <div className="page-container">
      <GlassCard
        card_id={rootCardId}
      />
    </div>
  );
}