import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateSurvey() {
  const navigate = useNavigate();

  const [surveyTitle, setSurveyTitle] = useState("");
  const [surveyDescription, setSurveyDescription] = useState("");

  const [questions, setQuestions] = useState([
    { id: 1, text: "", options: [{ text: "", rating: 1 }] }
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: Date.now(), text: "", options: [{ text: "", rating: 1 }] }
    ]);
  };

  const deleteQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const addOption = (id) => {
    setQuestions(
      questions.map((q) =>
        q.id === id
          ? { ...q, options: [...q.options, { text: "", rating: 1 }] }
          : q
      )
    );
  };

  const handleQuestionChange = (id, value) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, text: value } : q))
    );
  };

  const handleOptionTextChange = (qid, index, value) => {
    setQuestions(
      questions.map((q) =>
        q.id === qid
          ? {
              ...q,
              options: q.options.map((opt, i) =>
                i === index ? { ...opt, text: value } : opt
              )
            }
          : q
      )
    );
  };

  const handleOptionRatingChange = (qid, index, value) => {
    setQuestions(
      questions.map((q) =>
        q.id === qid
          ? {
              ...q,
              options: q.options.map((opt, i) =>
                i === index ? { ...opt, rating: Number(value) } : opt
              )
            }
          : q
      )
    );
  };

  const handleSaveSurvey = () => {
    if (!surveyTitle.trim()) {
      alert("Please enter a survey title.");
      return;
    }

    const newSurvey = {
      id: Date.now(),
      title: surveyTitle,
      description: surveyDescription,
      questions,
    };

    const existing = JSON.parse(localStorage.getItem("surveys")) || [];
    existing.push(newSurvey);
    localStorage.setItem("surveys", JSON.stringify(existing));

    alert("Survey saved successfully!");
    setSurveyTitle("");
    setSurveyDescription("");
    setQuestions([{ id: 1, text: "", options: [{ text: "", rating: 1 }] }]);
  };

  return (
    <div className="create-survey-container">
      <style>{`
        .create-survey-container {
          background-color: #f8f9fc;
          min-height: 100vh;
          padding: 40px;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        .header h1 {
          font-size: 28px;
          font-weight: 700;
          color: #222;
        }
        .back-btn {
          background-color: #007bff;
          color: white;
          font-weight: 600;
          border: none;
          padding: 10px 18px;
          border-radius: 6px;
          cursor: pointer;
          transition: 0.3s;
        }
        .back-btn:hover {
          background-color: #0056b3;
        }
        .card {
          background-color: white;
          padding: 20px 25px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          margin-bottom: 25px;
          border: 1px solid #eee;
        }
        .card h2 {
          font-size: 20px;
          color: #333;
          margin-bottom: 8px;
        }
        .input, .textarea {
          width: 100%;
          border: 1px solid #ccc;
          border-radius: 6px;
          padding: 10px;
          margin-bottom: 12px;
          font-size: 15px;
          outline: none;
        }
        .textarea {
          height: 100px;
          resize: vertical;
        }
        .section-title {
          font-size: 20px;
          color: #333;
          margin-bottom: 12px;
          font-weight: 600;
        }
        .option-label {
          font-size: 14px;
          color: #666;
          margin-bottom: 8px;
        }
        .add-option-btn {
          background: none;
          border: none;
          color: #007bff;
          cursor: pointer;
          margin-top: 8px;
          font-weight: 500;
        }

        /* ⭐ NEW BUTTON STYLES */
        .secondary-btn {
          background: white;
          border: 2px solid #007bff;
          color: #007bff;
          padding: 10px 18px;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          transition: 0.3s;
          margin-right: 12px;
        }
        .secondary-btn:hover {
          background: #e8f0ff;
        }

        .gray-btn,
        .blue-btn {
          background: #28a745;
          color: white;
          padding: 10px 18px;
          font-weight: 600;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: 0.3s;
          margin-right: 12px;
        }
        .gray-btn:hover,
        .blue-btn:hover {
          background: #1e7e34;
        }

        .bottom-buttons {
          margin-top: 20px;
        }
      `}</style>

      <div className="header">
        <h1>Create New Survey</h1>
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </div>

      <div className="card">
        <h2>Survey Details</h2>
        <p>Provide basic information about your survey.</p>

        <input
          type="text"
          placeholder="Survey Title"
          className="input"
          value={surveyTitle}
          onChange={(e) => setSurveyTitle(e.target.value)}
        />

        <textarea
          placeholder="Survey Description"
          className="textarea"
          value={surveyDescription}
          onChange={(e) => setSurveyDescription(e.target.value)}
        />
      </div>

      <h2 className="section-title">Survey Questions</h2>

      {questions.map((q, index) => (
        <div className="card" key={q.id}>
          <div className="question-header">
            <h3>Question {index + 1}</h3>
            <button className="delete-btn" onClick={() => deleteQuestion(q.id)}>
              🗑
            </button>
          </div>

          <input
            type="text"
            placeholder="Enter your question"
            className="input"
            value={q.text}
            onChange={(e) => handleQuestionChange(q.id, e.target.value)}
          />

          <p className="option-label">Options</p>

          {q.options.map((opt, i) => (
            <div key={i} style={{ marginBottom: "15px" }}>
              <input
                type="text"
                placeholder={`Option ${i + 1}`}
                className="input"
                value={opt.text}
                onChange={(e) =>
                  handleOptionTextChange(q.id, i, e.target.value)
                }
              />

              <select
                className="input"
                value={opt.rating}
                onChange={(e) =>
                  handleOptionRatingChange(q.id, i, e.target.value)
                }
              >
                <option value="1">1 - Good</option>
                <option value="2">2 - Average</option>
                <option value="3">3 - Bad</option>
              </select>
            </div>
          ))}

          <button className="add-option-btn" onClick={() => addOption(q.id)}>
            + Add Option
          </button>
        </div>
      ))}

      <div className="bottom-buttons">
        <button className="secondary-btn" onClick={addQuestion}>
          + Add Question
        </button>

        <button className="gray-btn" onClick={handleSaveSurvey}>
          Save Survey
        </button>

        <button className="blue-btn" onClick={() => navigate("/viewsurvey")}>
          View Saved Surveys
        </button>
      </div>
    </div>
  );
}