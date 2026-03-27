import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import api from "../api";

export default function SurveyAnalytics() {

  const navigate = useNavigate();

  const COLORS = {
    dark: "#3E2723",
    main: "#D4A373",
    secondary: "#8D6E63",
    light: "#FFF3E0",
    bg: "#FFF3E0",
    white: "#ffffff",
  };

  const [surveys,setSurveys] = useState([]);
  const [responses,setResponses] = useState([]);
  const [questions,setQuestions] = useState({});
  const [cycles,setCycles] = useState([]);

  const [selectedSurvey,setSelectedSurvey] = useState("");
  const [selectedCycle,setSelectedCycle] = useState("");

  const [questionCharts,setQuestionCharts] = useState([]);
  const [totalResponses,setTotalResponses] = useState(0);

  useEffect(()=>{
    const loadData = async()=>{
      try{
        const surveysRes = await api.get("/surveys");
        const responsesRes = await api.get("/responses");

        setSurveys(Array.isArray(surveysRes.data) ? surveysRes.data : []);
        setResponses(Array.isArray(responsesRes.data) ? responsesRes.data : []);
      }
      catch(err){
        console.error(err);
      }
    };
    loadData();
  },[]);

  useEffect(()=>{
    if(!selectedSurvey) return;

    const loadQuestions = async()=>{
      try{
        const qRes = await api.get(`/questions/${selectedSurvey}`);
        const qData = qRes.data?.Questions || [];

        const map = {};
        qData.forEach(q=>{
          map[q.Qno] = q.Text;
        });

        setQuestions(map);
      }
      catch(err){
        console.error(err);
      }
    };

    loadQuestions();
  },[selectedSurvey]);

  useEffect(()=>{
    if(!selectedSurvey) return;

    const surveyResponses = responses.filter(
      r => String(r.survey_id) === String(selectedSurvey)
    );

    const uniqueCycles = [...new Set(surveyResponses.map(r => r.cycle_id))];

    setCycles(uniqueCycles);

  },[selectedSurvey,responses]);

  useEffect(()=>{

    if(!selectedSurvey || !selectedCycle) return;

    const surveyResponses = responses.filter(
      r =>
        String(r.survey_id) === String(selectedSurvey) &&
        String(r.cycle_id) === String(selectedCycle)
    );

    setTotalResponses(surveyResponses.length);

    const questionMap = {};

    surveyResponses.forEach(r=>{
      if(Array.isArray(r.answers)){
        r.answers.forEach(a=>{
          const qid = a.question_id;
          const option = a.value_text || a.value;
          let rating = Number(a.rating || a.value || 1); // ensure rating is numeric

          if(!questionMap[qid]){
            questionMap[qid] = {
              question: questions[qid] || `Question ${qid}`,
              options:{},
              ratings:{}
            };
          }

          if(!questionMap[qid].options[option]){
            questionMap[qid].options[option] = 0;
            questionMap[qid].ratings[option] = rating;
          }

          questionMap[qid].options[option]++;
        });
      }
    });

    const charts = Object.values(questionMap).map(q=>({
      question:q.question,
      data:Object.entries(q.options).map(([key,value])=>({
        name:key,
        value:value,
        rating:q.ratings[key]
      }))
    }));

    setQuestionCharts(charts);

  },[selectedSurvey,selectedCycle,responses,questions]);

  // ✅ LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Map rating to colors
  const getColorByRating = (rating) => {
    switch(Number(rating)){
      case 1: return "#4CAF50"; // Green for Good
      case 2: return "#FFEB3B"; // Yellow for Average
      case 3: return "#FF9800"; // Orange for Moderate
      case 4: return "#F44336"; // Red for Poor
      default: return "#8D6E63"; // fallback brown
    }
  };

  return(
    <div style={styles.container}>

      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <img src="/logo.png" alt="logo" style={styles.logoImg} />
        <div style={styles.sidebarCenter}>
          <h1 style={styles.logo}>Survey Analytics</h1>
          <p style={styles.sidebarDesc}>
            Analyze survey responses and visualize insights
            using charts and reports.
          </p>
        </div>
        <div style={styles.sidebarBottom}>
          <button style={styles.sideBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div style={styles.main}>

        <h1 style={{color:COLORS.dark}}>Survey Analytics</h1>

        {/* FILTERS */}
        <div style={{display:"flex",gap:20,marginTop:20}}>

          <select
            value={selectedSurvey}
            onChange={(e)=>{
              setSelectedSurvey(e.target.value);
              setSelectedCycle("");
              setQuestionCharts([]);
            }}
            style={styles.input}
          >
            <option value="">Select Survey</option>
            {surveys.map(s=>(
              <option key={s.id || s._id} value={s.id || s._id}>
                {s.title}
              </option>
            ))}
          </select>

          {cycles.length > 0 && (
            <select
              value={selectedCycle}
              onChange={(e)=>setSelectedCycle(e.target.value)}
              style={styles.input}
            >
              <option value="">Select Cycle</option>
              {cycles.map(c=>(
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}
        </div>

        {/* TOTAL */}
        {selectedCycle && (
          <div style={styles.card}>
            <strong>Total Responses</strong>
            <div style={{fontSize:28,color:COLORS.dark}}>
              {totalResponses}
            </div>
          </div>
        )}

        {/* CHARTS */}
        <div style={styles.chartGrid}>
          {questionCharts.map((q,index)=>(
            <div key={index} style={styles.card}>
              <h3>{q.question}</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={q.data} dataKey="value" outerRadius={90}>
                    {q.data.map((entry,i)=>(
                      <Cell key={i} fill={getColorByRating(entry.rating)} />
                    ))}
                  </Pie>
                  <Tooltip/>
                  <Legend/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>

        {/* BACK BUTTON */}
        <div style={{textAlign:"center", marginTop:"40px"}}>
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
marginTop:"20px",
border:"1px solid #D4A373"
},

input:{
padding:"10px",
borderRadius:"6px",
border:"1px solid #D4A373"
},

chartGrid:{
display:"grid",
gridTemplateColumns:"1fr 1fr",
gap:"30px",
marginTop:"30px"
},

backBtn:{
background:"#3E2723",
color:"#FFF3E0",
padding:"12px 25px",
borderRadius:"12px",
border:"none",
cursor:"pointer",
fontSize:"15px"
}

};