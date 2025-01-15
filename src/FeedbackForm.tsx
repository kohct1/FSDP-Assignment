import React, { useState } from "react";

const FeedbackForm = () => {
  const [rating, setRating] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [visible, setVisible] = useState(true); 

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Feedback submitted:", { rating, feedback });
    alert("Thank you for your feedback!");
  };

  const emojis = [
    { id: 1, name: "angry", unselected: "/images/Emojis/Angry_Uncoloured.svg", selected: "/images/Emojis/Angry_Coloured.svg" },
    { id: 2, name: "sad", unselected: "/images/Emojis/Sad_Uncoloured.svg", selected: "/images/Emojis/Sad_Coloured.svg" },
    { id: 3, name: "neutral", unselected: "/images/Emojis/Meh_Uncoloured.svg", selected: "/images/Emojis/Meh_Coloured.svg" },
    { id: 4, name: "happy", unselected: "/images/Emojis/Happy_Uncoloured.svg", selected: "/images/Emojis/Happy_Coloured.svg" },
    { id: 5, name: "love", unselected: "/images/Emojis/Happiest_Uncoloured.svg", selected: "/images/Emojis/Happiest_Filled.svg" },
  ];

  if (!visible) return null; 

  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f4f4f4", position: "relative"
    }}>
      <div style={{
        border: "1px solid #ccc", padding: "30px", maxWidth: "600px", width: "100%", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.1)", background: "white", position: "relative"
      }}>
        {/* Close Button (X) */}
        <button 
          onClick={() => setVisible(false)} 
          style={{
            position: "absolute", top: "10px", right: "20px", background: "transparent", border: "none", fontSize: "30px", cursor: "pointer", color: "#888"
          }}
        >
          &times;
        </button>

        <h3 style={{
          textAlign: "center", fontSize: "32px", marginBottom: "10px"
        }}>Help us improve!</h3>
        <p style={{
          textAlign: "center", fontSize: "24px", marginBottom: "10px"
        }}>How did your call go?</p>
        <div style={{
          display: "flex", justifyContent: "center", gap: "25px", marginBottom: "20px" // Increased gap for larger emojis
        }}>
          {emojis.map((emoji) => (
            <button
              key={emoji.id}
              onClick={() => setRating(emoji.id)}
              style={{ background: "transparent", border: "none", cursor: "pointer" }}
            >
              <img
                src={rating === emoji.id ? emoji.selected : emoji.unselected}
                alt={emoji.name}
                style={{ width: "50px", height: "50px" }} 
              />
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} style={{
          display: "flex", flexDirection: "column", alignItems: "center"
        }}>
          <label style={{
            width: "100%", fontSize: "24px", marginBottom: "10px"
          }}>
            How can we improve your calling experience?
          </label>
          <div style={{ position: "relative", width: "100%" }}>
            <textarea
              style={{
                width: "100%", height: "80px", fontSize: "16px", border: "1px solid #ccc", borderRadius: "5px", padding: "10px", resize: "none"
              }}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              maxLength={500}
            />
            <div style={{
              position: "absolute", bottom: "5px", right: "10px", fontSize: "12px", color: "#888"
            }}>
              {feedback.length}/500
            </div>
          </div>
          <button type="submit" style={{
            marginTop: "20px", backgroundColor: "#da291c", color: "white", padding: "12px 20px", border: "none", borderRadius: "5px", fontSize: "22px", cursor: "pointer"
          }}>
            Submit feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
