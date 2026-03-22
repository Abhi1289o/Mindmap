import { useState, useEffect, useRef } from "react";
import "../styles/glasscard.css";

export default function GlassCard({ card_id: initialCardId, user_id }) {
  const cardRef = useRef(null);
  const [notification, setNotification] = useState(null); // { message, type }
  const [card_id, setCardId] = useState(initialCardId);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 2500);
  };

  const fetchCard = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/cards/${id}`);
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

  // Fetch card content when card_id changes
  useEffect(() => {
    if (!card_id) return;
    fetchCard(card_id);
  }, [card_id]);

  const handleSave = async () => {
    const htmlContent = cardRef.current.innerHTML;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;

    const h1 = tempDiv.querySelector("h1");
    const title = h1 ? h1.innerText : "Untitled";
    if (h1) h1.remove();

    let content = tempDiv.innerHTML.slice(3, -4);

    try {
      const response = await fetch(`http://localhost:5000/cards/${card_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      const data = await response.json();

      if (data.success) showNotification("Saved successfully!", "success");
      else showNotification("Save failed!", "error");
    } catch (err) {
      console.error(err);
      showNotification("Error saving!", "error");
    }
  };

  const handleCreateLink = async () => {
    const selection = window.getSelection();

    if (!selection.rangeCount || selection.isCollapsed) {
      showNotification("Please select text first", "error");
      return;
    }

    try {
      // Call backend to create a new card + link
      const res = await fetch("http://localhost:5000/cards/createcard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user_id,
          source_card_id: card_id, // current card
        }),
      });

      const data = await res.json();

      if (!data.card_id || !data.link_id) {
        showNotification("Failed to create new card/link", "error");
        return;
      }

      const newCardId = data.card_id;
      const newLinkId = data.link_id;

      // Wrap selected text in <a>
      const range = selection.getRangeAt(0);
      const anchor = document.createElement("a");
      anchor.href = `/card/${newCardId}`;
      anchor.setAttribute("data-card-id", newCardId);
      anchor.setAttribute("data-link-id", newLinkId);
      anchor.style.color = "#4da6ff";
      anchor.style.textDecoration = "underline";

      anchor.appendChild(range.extractContents());
      range.insertNode(anchor);

      selection.removeAllRanges();

      showNotification("Link created successfully!", "success");

      await handleSave(); // save the updated card
    } catch (err) {
      console.error(err);
      showNotification("Error creating link", "error");
    }
  };

  const handleLinkClick = (e) => {
    const target = e.target;
    if (target.tagName === "A" && target.dataset.cardId) {
      e.preventDefault();
      const linkedCardId = target.dataset.cardId;
      setCardId(linkedCardId);
      fetchCard(linkedCardId);
    }
  };

  const handleBack = () => {
    return;
  }

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

      {/* Buttons */}
      <div className="button-group">
        <button className="back-button" onClick={handleBack}>
          ↑ Back
        </button>
        <div></div>
        <button className="create-button" onClick={handleCreateLink}>
          Create Link
        </button>
        <button className="save-button" onClick={handleSave}>
          Save
        </button>
      </div>

      {/* Editable card */}
      <div
        className="glass-card"
        contentEditable
        ref={cardRef}
        suppressContentEditableWarning={true}
        onClick={handleLinkClick} // handle internal link clicks
      />
    </div>
  );
}