// src/pages/Header.jsx
export default function Header() {
  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh", 
      backgroundColor: "#1e1b4b", 
      color: "white",
      flexDirection: "column"
    }}>
      <h1>Welcome to MindMap!</h1>
      <p>You have successfully logged in.</p>
    </div>
  );
}