import { useEffect, useRef } from "react";
import "../styles/glasscard.css";

export default function GlassCard({ id, defaultContent }) {
  const cardRef = useRef(null);

  // Load saved content once
  useEffect(() => {
    const saved = localStorage.getItem(id);
    if (saved && cardRef.current) {
      cardRef.current.innerHTML = saved;
    } else if (cardRef.current) {
      cardRef.current.innerHTML = defaultContent;
    }
  }, [id, defaultContent]);

  // Save function (can be replaced with PostgreSQL call later)
  const handleSave = () => {
    if (cardRef.current) {
      const content = cardRef.current.innerHTML;
      localStorage.setItem(id, content); // temporary storage
      alert("Card saved!"); // optional feedback
      console.log("Saved content:", content); // you can send this to backend
    }
  };

  return (
    <div className="glass-card-container">
      {/* Save button */}
      <button className="save-button" onClick={handleSave}>
        Save
      </button>

      {/* Editable card */}
      <div
        className="glass-card"
        contentEditable
        ref={cardRef}
      />
    </div>
  );
}