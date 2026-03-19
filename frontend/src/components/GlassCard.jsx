import { useEffect, useRef } from "react";
import "../styles/glasscard.css";

export default function GlassCard({ card_id }) {
  const cardRef = useRef(null);

  // Fetch card content once
  useEffect(() => {
    if (!card_id) return;

    const fetchCard = async () => {
      try {
        const res = await fetch(`http://localhost:5000/cards/${card_id}`);
        if (!res.ok) throw new Error("Failed to fetch card");
        const data = await res.json();

        if (cardRef.current) {
          cardRef.current.innerHTML = `<h1>${data.title || "Untitled"}</h1><p>${data.content || ""}</p>`;
        }
      } catch (err) {
        console.error(err);
        if (cardRef.current) {
          cardRef.current.innerHTML = "<h1>Error loading card</h1>";
        }
      }
    };

    fetchCard();
  }, [card_id]);

  // save to backend later
  const handleSave = () => {
    return;
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
        suppressContentEditableWarning={true} // suppress React warning
      />
    </div>
  );
}