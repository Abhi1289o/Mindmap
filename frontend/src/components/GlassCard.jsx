import { useState, useEffect, useRef } from "react";
import "../styles/glasscard.css";

export default function GlassCard({ card_id }) {
  const cardRef = useRef(null);
  const [notification, setNotification] = useState(null); // { message, type }

  const showNotification = (message, type) => {
    setNotification({ message, type });

    // Hide after 5 seconds
    setTimeout(() => setNotification(null), 2500);
  };

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

  const handleSave = async () => {
    const htmlContent = cardRef.current.innerHTML;

    // Create a temporary DOM element to parse HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;

    // Extract title from first h1
    const h1 = tempDiv.querySelector("h1");
    const title = h1 ? h1.innerText : "Untitled";

    // Extract content from the rest (remove h1)
    if (h1) h1.remove(); // remove h1 from tempDiv
    const content = tempDiv.innerHTML; // rest of content including <p>, <ul>, etc.

    try {
      const response = await fetch(`http://localhost:5000/cards/${card_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          content: content,
        }),
      });

      const data = await response.json();

      if (data.success) {
        showNotification("Saved successfully!", "success");
      } else {
        showNotification("Save failed!", "error");
      }
    } catch (err) {
      console.error(err);
      showNotification("Error saving!", "error");
    }
  };

  return (
    <div className="glass-card-container">
      {/* Notification */}
      {notification && (
        <div
          style={{
            position: "absolute",
            top: "-40px",
            right: "0",
            padding: "10px 20px",
            borderRadius: "5px",
            color: "white",
            backgroundColor: notification.type === "success" ? "green" : "red",
            transition: "opacity 0.3s",
            zIndex: 10,
          }}
        >
          {notification.message}
        </div>
      )}
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