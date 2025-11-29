import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ViewSurvey() {
  const [surveys, setSurveys] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedSurveys = JSON.parse(localStorage.getItem("surveys")) || [];
    setSurveys(savedSurveys);
  }, []);

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
      <h1>Saved Surveys</h1>

      {surveys.length === 0 ? (
        <p>No surveys found.</p>
      ) : (
        surveys.map((survey) => (
          <div
            key={survey.id}
            style={{
              border: "1px solid #ccc",
              padding: "20px",
              borderRadius: "10px",
              marginBottom: "20px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h2>{survey.title}</h2>
            <p>{survey.description}</p>

            <h4>Questions:</h4>
            <ul>
              {survey.questions.map((q) => (
                <li key={q.id}>
                  {q.text}
                  <ul>
                    {q.options.map((opt, index) => (
                      <li key={index}>
                        {opt.text} (Rating: {opt.rating})
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}

      {/* ✅ Move button to the bottom */}
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Back to Dashboard
      </button>
    </div>
  );
}
