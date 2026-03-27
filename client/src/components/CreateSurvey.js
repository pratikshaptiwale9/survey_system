import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function CreateSurvey() {
  const navigate = useNavigate();

  const COLORS = {
    dark: "#3E2723",
    main: "#D4A373",
    secondary: "#8D6E63",
    light: "#FFF3E0",
    bg: "#FFF3E0",
    white: "#ffffff",
  };

  const [surveyTitle, setSurveyTitle] = useState("");
  const [surveyDescription, setSurveyDescription] = useState("");
  const [targetParticipants, setTargetParticipants] = useState("");

  const [questions, setQuestions] = useState([
    {
      id: Date.now(),
      qno: 1,
      text: "",
      options: [{ text: "", rating: 1 }],
    },
  ]);

  // ✅ ADDED LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        qno: questions.length + 1,
        text: "",
        options: [{ text: "", rating: 1 }],
      },
    ]);
  };

  const deleteQuestion = (id) => {
    const updated = questions.filter((q) => q.id !== id);
    const reindexed = updated.map((q, index) => ({
      ...q,
      qno: index + 1,
    }));
    setQuestions(reindexed);
  };

  const addOption = (qid) => {
    setQuestions(
      questions.map((q) =>
        q.id === qid && q.options.length < 4
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
              ),
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
              ),
            }
          : q
      )
    );
  };

  const handleSaveSurvey = async () => {
    if (!surveyTitle.trim()) return alert("Enter survey title");
    if (!targetParticipants || Number(targetParticipants) <= 0)
      return alert("Enter valid target participants");

    const sendSurvey = {
      title: surveyTitle,
      createdBy: null,
      createdAt: new Date().toISOString(),
      currentParticipants: 0,
      targetParticipants: Number(targetParticipants),
      isCompleted: false,
    };

    try {
      const surveyRes = await api.post("/surveys", sendSurvey);
      const surveyId = surveyRes.data.survey_id;

      const formattedQuestions = questions.map((q) => ({
        qno: q.qno,
        text: q.text,
        options: q.options.map((opt, index) => ({
          optionId: index + 1,
          option: opt.text,
          rating: opt.rating,
        })),
      }));

      await api.post("/questions", {
        surveyId: surveyId,
        Questions: formattedQuestions,
      });

      alert("Survey saved successfully!");
      navigate("/view-survey");
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed to save survey.");
    }
  };

  return (
    <div style={styles.container}>

      {/* Sidebar */}
      <div style={styles.sidebar}>

        <img src="/logo.png" alt="logo" style={styles.logoImg} />

        <div style={styles.sidebarCenter}>
          <h1 style={styles.logo}>Create Survey</h1>

          <p style={styles.sidebarDesc}>
            Build surveys and add questions
            to collect participant feedback.
          </p>
        </div>

        <div style={styles.sidebarBottom}>
          {/* ✅ UPDATED BUTTON */}
          <button style={styles.sideBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>

      </div>

      {/* Main Content */}
      <div style={styles.main}>

        <h1 style={{color:COLORS.dark}}>Create New Survey</h1>

        {/* Survey Details */}
        <div style={styles.card}>

          <h2 style={{color:COLORS.dark}}>Survey Details</h2>

          <input
            type="text"
            placeholder="Survey Title"
            style={styles.input}
            value={surveyTitle}
            onChange={(e) => setSurveyTitle(e.target.value)}
          />

          <textarea
            placeholder="Survey Description (optional)"
            style={styles.input}
            value={surveyDescription}
            onChange={(e) => setSurveyDescription(e.target.value)}
          />

          <input
            type="number"
            placeholder="Target Participants"
            style={styles.input}
            value={targetParticipants}
            onChange={(e) => setTargetParticipants(e.target.value)}
          />

        </div>

        <h2 style={{color:COLORS.dark}}>Survey Questions</h2>

        {questions.map((q) => (
          <div key={q.id} style={styles.card}>

            <div style={{display:"flex",justifyContent:"space-between"}}>
              <h3>Question {q.qno}</h3>
              <button onClick={() => deleteQuestion(q.id)}>🗑</button>
            </div>

            <input
              type="text"
              placeholder="Enter your question"
              style={styles.input}
              value={q.text}
              onChange={(e) => handleQuestionChange(q.id, e.target.value)}
            />

            <p>Options</p>

            {q.options.map((opt, i) => (
              <div key={i}>

                <input
                  type="text"
                  placeholder={`Option ${i + 1}`}
                  style={styles.input}
                  value={opt.text}
                  onChange={(e) =>
                    handleOptionTextChange(q.id, i, e.target.value)
                  }
                />

                <select
                  style={styles.input}
                  value={opt.rating}
                  onChange={(e) =>
                    handleOptionRatingChange(q.id, i, e.target.value)
                  }
                >
                  <option value="1">1 - Good</option>
                  <option value="2">2 - Average</option>
                  <option value="3">3 - Moderate</option>
                  <option value="4">4 - Poor</option>
                </select>

              </div>
            ))}

            {q.options.length < 4 && (
              <button style={styles.addOptionBtn} onClick={() => addOption(q.id)}>
                + Add Option
              </button>
            )}

            <button style={styles.deleteBtn} onClick={() => deleteQuestion(q.id)}>
              Delete Question
            </button>

          </div>
        ))}

        <div style={{marginTop:20}}>

          <button style={styles.mainBtn} onClick={addQuestion}>
            + Add Question
          </button>

          <button style={styles.saveBtn} onClick={handleSaveSurvey}>
            Save Survey
          </button>

          <button
            style={styles.secondaryBtn}
            onClick={() => navigate("/view-survey")}
          >
            View Saved Surveys
          </button>

          <button
            style={styles.backBtn}
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>

        </div>

      </div>

    </div>
  );
}

const styles = {

container:{
display:"flex",
height:"100vh"
},

sidebar:{
width:"220px",
background:"#3E2723",
color:"#FFF3E0",
padding:"25px",
display:"flex",
flexDirection:"column",
alignItems:"center"
},

logoImg:{ width:"110px" },

sidebarCenter:{
flex:1,
display:"flex",
flexDirection:"column",
alignItems:"center",
justifyContent:"center"
},

logo:{
fontSize:"30px",
fontWeight:"700",
color:"#FFF3E0"
},

sidebarDesc:{
fontSize:"13px",
textAlign:"center",
marginTop:"10px",
opacity:"0.9",
lineHeight:"1.4",
padding:"0 5px",
color:"#FFF3E0"
},

sidebarBottom:{
display:"flex",
flexDirection:"column",
gap:"14px",
width:"100%"
},

sideBtn:{
padding:"13px",
borderRadius:"8px",
border:"1px solid #D4A373",
background:"transparent",
color:"#FFF3E0",
cursor:"pointer"
},

main:{
flex:1,
padding:"40px",
background:"#FFF3E0",
overflowY:"auto",
fontFamily:"Poppins, Arial"
},

card:{
background:"white",
padding:"25px",
borderRadius:"12px",
marginBottom:"20px",
boxShadow:"0 4px 12px rgba(0,0,0,0.1)",
border:"1px solid #D4A373"
},

input:{
width:"100%",
padding:"10px",
marginTop:"10px",
marginBottom:"10px",
border:"1px solid #D4A373",
borderRadius:"6px"
},

addOptionBtn:{
background:"#D4A373",
color:"#3E2723",
padding:"10px 18px",
borderRadius:"10px",
border:"none",
marginTop:"10px"
},

deleteBtn:{
background:"#8D6E63",
color:"#FFF3E0",
padding:"8px 14px",
borderRadius:"10px",
border:"none",
marginTop:"10px"
},

mainBtn:{
background:"#D4A373",
color:"#3E2723",
padding:"12px 22px",
borderRadius:"14px",
border:"none",
marginRight:"10px"
},

saveBtn:{
background:"#3E2723",
color:"#FFF3E0",
padding:"12px 22px",
borderRadius:"14px",
border:"none",
marginRight:"10px"
},

secondaryBtn:{
background:"#8D6E63",
color:"#FFF3E0",
padding:"12px 22px",
borderRadius:"14px",
border:"none",
marginRight:"10px"
},

backBtn:{
background:"#3E2723",
color:"#FFF3E0",
padding:"12px 22px",
borderRadius:"14px",
border:"none",
float:"right"
}

};