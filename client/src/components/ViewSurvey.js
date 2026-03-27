import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function ViewSurvey() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const COLORS = {
    dark: "#3E2723",
    main: "#D4A373",
    secondary: "#8D6E63",
    light: "#FFF3E0",
    bg: "#FFF3E0",
    white: "#ffffff",
    surveyorColors: ["#F44336", "#2196F3", "#FF9800", "#9C27B0", "#00BCD4"],
  };

  // ✅ LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleDeleteSurvey = async (surveyId) => {
    if (!window.confirm("⚠️ Are you sure you want to delete this survey?")) return;
    try {
      await api.delete(`/surveys/${surveyId}`);
      await api.delete(`/questions/${surveyId}`);
      setSurveys((prev) => prev.filter((s) => (s.id || s._id) !== surveyId));
      alert("Survey deleted successfully!");
    } catch (err) {
      console.error("Error deleting survey:", err);
      alert("Failed to delete survey.");
    }
  };

  useEffect(() => {
    const loadSurveys = async () => {
      try {
        const surveyRes = await api.get("/surveys");
        const list = Array.isArray(surveyRes.data) ? surveyRes.data : [];

        const fullData = await Promise.all(
          list.map(async (s) => {
            try {
              const qRes = await api.get(`/questions/${s.id}`);
              const data = qRes.data;
              let questions = [];

              if (data && Array.isArray(data.Questions)) {
                questions = data.Questions.map((q) => ({
                  qno: q.Qno,
                  text: q.Text,
                  options: Array.isArray(q.Options)
                    ? q.Options.map((opt) => ({
                        optionId: opt.OptionId,
                        option: opt.Option,
                      }))
                    : [],
                }));
              }

              const completedParticipants = s.responses?.length || 0;

              let surveyorProgress = {};
              if (s.responses && Array.isArray(s.responses)) {
                s.responses.forEach((r) => {
                  if (!surveyorProgress[r.surveyorName]) surveyorProgress[r.surveyorName] = 0;
                  surveyorProgress[r.surveyorName] += 1;
                });
              }

              return { ...s, questions, completedParticipants, surveyorProgress };
            } catch {
              return { ...s, questions: [], completedParticipants: 0, surveyorProgress: {} };
            }
          })
        );

        const sortedSurveys = fullData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setSurveys(sortedSurveys);
      } catch (err) {
        console.error("Failed to load surveys:", err);
        setSurveys([]);
      } finally {
        setLoading(false);
      }
    };

    loadSurveys();
  }, []);

  return (
    <div style={styles.container}>

      {/* Sidebar */}
      <div style={styles.sidebar}>
        <img src="/logo.png" alt="logo" style={styles.logoImg} />

        <div style={styles.sidebarCenter}>
          <h1 style={styles.logo}>Saved Surveys</h1>

          <p style={styles.sidebarDesc}>
            View all created surveys and
            track participant progress.
          </p>
        </div>

        <div style={styles.sidebarBottom}>
          {/* ✅ LOGOUT BUTTON */}
          <button style={styles.sideBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.main}>

        {/* HEADER WITH BUTTON */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 25
        }}>
          <h1 style={{ fontSize: "32px", color: COLORS.dark }}>
            Saved Surveys
          </h1>

          <button
            onClick={() => navigate("/dashboard")}
            style={{
              padding: "10px 20px",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              background: COLORS.dark,
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
            }}
          >
            Back to Dashboard
          </button>
        </div>

        {loading ? (
          <p>Loading surveys...</p>
        ) : surveys.length === 0 ? (
          <p>No surveys found.</p>
        ) : (
          surveys.map((survey) => {
            const percent =
              survey.targetParticipants > 0
                ? ((survey.completedParticipants / survey.targetParticipants) * 100).toFixed(1)
                : 0;

            const surveyorNames = Object.keys(survey.surveyorProgress || {});

            return (
              <div key={survey.id || survey._id} style={styles.card}>

                <h2 style={{ color: COLORS.dark }}>{survey.title}</h2>

                <button
                  onClick={() => handleDeleteSurvey(survey.id || survey._id)}
                  style={styles.deleteBtn}
                >
                  🗑 Delete Survey
                </button>

                <p>
                  <b>Target Participants:</b> {survey.targetParticipants}
                </p>

                <div style={styles.progressBox}>
                  <div style={styles.progressBar}>
                    <div
                      style={{
                        width: `${percent}%`,
                        background: COLORS.main,
                        height: "100%",
                      }}
                    />
                  </div>

                  {surveyorNames.map((surveyor, idx) => {
                    const count = survey.surveyorProgress[surveyor];
                    const p =
                      survey.targetParticipants > 0
                        ? ((count / survey.targetParticipants) * 100).toFixed(1)
                        : 0;

                    const color = COLORS.surveyorColors[idx % COLORS.surveyorColors.length];

                    return (
                      <div key={surveyor} style={{ marginBottom: 8 }}>
                        <p>
                          {surveyor}: {count} / {survey.targetParticipants} ({p}%)
                        </p>

                        <div style={styles.smallBar}>
                          <div
                            style={{
                              width: `${p}%`,
                              background: color,
                              height: "100%",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <h3>📝 Questions</h3>

                {survey.questions?.length > 0 ? (
                  survey.questions.map((q) => (
                    <div key={q.qno} style={styles.questionCard}>
                      <strong>
                        Q{q.qno}: {q.text}
                      </strong>

                      <ul>
                        {q.options.map((opt) => (
                          <li key={opt.optionId}>{opt.option}</li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <p>No questions found.</p>
                )}
              </div>
            );
          })
        )}

      </div>
    </div>
  );
}

const styles = {

container:{
display:"flex",
minHeight:"100vh"
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

logoImg:{
width:"110px"
},

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
borderRadius:"14px",
marginBottom:"25px",
boxShadow:"0 4px 12px rgba(0,0,0,0.1)"
},

deleteBtn:{
background:"#8D6E63",
color:"white",
padding:"8px 16px",
borderRadius:"10px",
border:"none",
cursor:"pointer",
marginTop:10
},

smallBar:{
height:"10px",
background:"#eee",
borderRadius:"8px",
overflow:"hidden"
},

questionCard:{
background:"#FFF3E0",
padding:"15px",
borderRadius:"10px",
marginBottom:"12px"
}

};