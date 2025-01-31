import React, { useState, useEffect } from "react";

const FeedbackForm = ({  }) => {
  const [rating, setRating] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const response = await fetch("http://localhost:5050/decode/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
      }),
    });

    const result = await response.json();
    setUserId(result.userId);
    console.log("User ID:", result.userId);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!rating) {
      alert("Please select a rating.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5050/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          rating: rating,
          feedback: feedback,
        }),
      });

      const result = await response.json();
      console.log("Server response:", result);

      if (response.ok) {
        alert("Thank you for your feedback!");
        setRating(null);
        setFeedback("");
      } else {
        alert(`Error: ${result.message || "An error occurred while submitting your feedback."}`);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("An error occurred while submitting your feedback.");
    } finally {
      setLoading(false);
      setVisible(false);
    }
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
    <div
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
    >
      <div
        className="relative bg-white border border-gray-300 p-8 max-w-xl w-full rounded-lg shadow-lg transition-all duration-300"
      >
        <button
          className="absolute top-2 right-4 text-gray-500 text-2xl hover:text-gray-700 focus:outline-none"
          onClick={() => setVisible(false)}
        >
          &times;
        </button>
  
        <h3 className="text-center text-2xl font-bold mb-4">Help us improve!</h3>
        <p className="text-center text-lg text-gray-600 mb-6">
          How did your call go?
        </p>
  
        <div className="flex justify-center gap-5 mb-6">
          {emojis.map((emoji) => (
            <button
              key={emoji.id}
              onClick={() => setRating(emoji.id)}
              className="focus:outline-none"
              title={emoji.name}
            >
              <img
                src={rating === emoji.id ? emoji.selected : emoji.unselected}
                alt={`${emoji.name} emoji`}
                className="w-12 h-12 transition-transform duration-300"
              />
            </button>
          ))}
        </div>
  
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center"
        >
          <label
            className="w-full text-lg font-medium mb-2"
          >
            How can we improve your calling experience?
          </label>
          <div className="relative w-full">
            <textarea
              className="w-full h-24 text-base border border-gray-300 rounded-md p-3 resize-none outline-none focus:ring focus:ring-red-300"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              maxLength={500}
              placeholder="What went well? What could be improved?"
            />
            <div
              className="absolute bottom-2 right-3 text-xs text-gray-500"
            >
              {feedback.length}/500
            </div>
          </div>
          <button
            type="submit"
            className={`mt-5 bg-red-600 text-white px-6 py-3 rounded-md font-semibold text-lg transition ${
              loading ? "cursor-not-allowed opacity-70" : "hover:bg-red-500"
            }`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
