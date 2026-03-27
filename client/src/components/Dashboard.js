import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaUsers, FaChartBar, FaClipboardList, FaUserTie, FaCircle } from "react-icons/fa";
import api from "../api";

function Dashboard() {

  const navigate = useNavigate();

  const [participantCount, setParticipantCount] = useState(0);
  const [activities, setActivities] = useState([]);
  const [surveyCount, setSurveyCount] = useState(0);

  // ✅ ADDED LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    fetchCounts();

    const interval = setInterval(() => {
      fetchCounts();
    }, 10000);

    return () => clearInterval(interval);

  }, []);

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    for (let key in intervals) {
      const value = Math.floor(seconds / intervals[key]);
      if (value >= 1) {
        return `${value} ${key}${value > 1 ? "s" : ""} ago`;
      }
    }

    return "Just now";
  };

  const fetchCounts = async () => {
    try {

      const participantsRes = await api.get("/participants");
      const surveyorsRes = await api.get("/surveyors");
      const surveysRes = await api.get("/surveys");

      const participants = participantsRes.data || [];
      const surveyors = surveyorsRes.data || [];
      const surveys = surveysRes.data || [];

      setParticipantCount(participants.length);
      setSurveyCount(surveys.length);

      let recentActivities = [];

      participants.slice(-2).reverse().forEach((p) => {
        recentActivities.push({
          type: "participant",
          text: `New participant added: ${p.name}`,
        });
      });

      surveyors.slice(-2).reverse().forEach((s) => {
        recentActivities.push({
          type: "surveyor",
          text: `New surveyor added: ${s.name}`,
        });
      });

      surveys.slice(-1).reverse().forEach((s) => {
        recentActivities.push({
          type: "survey",
          text: `Survey "${s.title || "New Survey"}" created`,
        });
      });

      setActivities(recentActivities.slice(0, 5));

    } catch (err) {
      console.error(err);
    }
  };

  return (

    <div style={styles.container}>

      {/* Sidebar */}
      <div style={styles.sidebar}>
        <img src="/logo.png" alt="Company Logo" style={styles.sidebarLogo} />

        <div style={styles.sidebarCenter}>
          <h1 style={styles.logo}>Dashboard</h1>
        </div>

        <div style={styles.sidebarBottom}>
          {/* ✅ UPDATED BUTTON */}
          <button style={styles.sideBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={styles.main}>

        <div style={styles.dashboardHeader}>
          <h2 style={styles.dashboardTitle}>Survey Management Dashboard</h2>

          <p style={styles.dashboardText}>
            Manage surveys, monitor participants, and analyse survey progress
            from a single control panel.
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div style={styles.actions}>

          <div style={styles.row}>
            <button style={styles.actionBtn} onClick={()=>navigate("/create-survey")}>
              <FaPlus style={styles.icon}/> Create Survey
            </button>

            <button style={styles.actionBtn} onClick={()=>navigate("/view-participants")}>
              <FaUsers style={styles.icon}/> View Participants
            </button>
          </div>

          <div style={styles.row}>
            <button style={styles.actionBtn} onClick={()=>navigate("/view-survey")}>
              <FaClipboardList style={styles.icon}/> View Survey
            </button>

            <button style={styles.actionBtn} onClick={()=>navigate("/manage-surveyor")}>
              <FaUserTie style={styles.icon}/> Manage Surveyors
            </button>
          </div>

          <div style={styles.row}>
            <button style={styles.actionBtn} onClick={()=>navigate("/survey-analytics")}>
              <FaChartBar style={styles.icon}/> Survey Analytics
            </button>
          </div>

        </div>

        {/* CONTENT SECTION */}
        <div style={styles.contentSection}>

          <div style={styles.activityBox}>
            <h3 style={{color:"#3E2723"}}>Recent Activity</h3>

            <ul>
              {activities.length === 0
                ? <li>No recent activity</li>
                : activities.map((act, index) => (
                  <li key={index} style={styles.activityItem}>
                    <FaCircle style={{
                      color:
                        act.type==="participant" ? "#4CAF50"
                        : act.type==="survey" ? "#D4A373"
                        : "#8D6E63",
                      fontSize:"10px"
                    }}/>
                    <span>{act.text}</span>
                    <small style={styles.time}>{act.time}</small>
                  </li>
                ))
              }
            </ul>
          </div>

          <div style={styles.statsColumn}>

            <div style={styles.totalCard}>
              <h3>Total Participants</h3>
              <h1>{participantCount}</h1>
            </div>

            <div style={styles.targetCard}>
              <h3>Total Surveys</h3>
              <h1>{surveyCount}</h1>
            </div>

          </div>

        </div>

      </div>

    </div>

  );
}

export default Dashboard;

const styles = {
  container:{display:"flex",height:"100vh",fontFamily:"Segoe UI",backgroundColor:"#FFF3E0"},

  sidebar:{width:"220px",backgroundColor:"#3E2723",color:"#FFF3E0",padding:"25px 15px",display:"flex",flexDirection:"column",justifyContent:"space-between",alignItems:"center"},

  sidebarLogo:{width:"110px",marginTop:"10px"},

  sidebarCenter:{display:"flex",alignItems:"center",justifyContent:"center",flex:1},

  logo:{fontSize:"22px",fontWeight:"600",textAlign:"center",color:"#FFF3E0"},

  sidebarBottom:{display:"flex",flexDirection:"column",gap:"12px",width:"100%",marginBottom:"20px"},

  sideBtn:{padding:"10px",borderRadius:"6px",border:"1px solid #D4A373",background:"transparent",color:"#FFF3E0",cursor:"pointer",width:"100%"},

  main:{flex:1,padding:"30px"},

  dashboardHeader:{marginBottom:"20px"},

  dashboardTitle:{marginBottom:"5px",color:"#3E2723"},

  dashboardText:{color:"#8D6E63",maxWidth:"650px",fontSize:"14px"},

  actions:{marginBottom:"20px"},

  row:{display:"flex",gap:"20px",marginBottom:"15px"},

  actionBtn:{flex:1,padding:"16px",fontSize:"15px",borderRadius:"10px",border:"none",backgroundColor:"#D4A373",color:"#3E2723",cursor:"pointer",boxShadow:"0 4px 10px rgba(0,0,0,0.15)",display:"flex",alignItems:"center",justifyContent:"center",gap:"10px"},

  icon:{fontSize:"16px"},

  contentSection:{display:"flex",gap:"25px"},

  activityBox:{flex:2,backgroundColor:"white",padding:"22px",borderRadius:"12px",boxShadow:"0 4px 12px rgba(0,0,0,0.1)",border:"1px solid #D4A373"},

  activityItem:{display:"flex",alignItems:"center",gap:"10px",marginBottom:"10px",fontSize:"14px",color:"#3E2723"},

  time:{marginLeft:"auto",color:"#8D6E63",fontSize:"12px"},

  statsColumn:{flex:1,display:"flex",flexDirection:"column",gap:"15px"},

  totalCard:{backgroundColor:"#FFFFFF",color:"#3E2723",padding:"18px",borderRadius:"12px",textAlign:"center",boxShadow:"0 4px 10px rgba(0,0,0,0.08)",border:"1px solid #D4A373"},

  targetCard:{backgroundColor:"#FFFFFF",color:"#3E2723",padding:"18px",borderRadius:"12px",textAlign:"center",boxShadow:"0 4px 10px rgba(0,0,0,0.08)",border:"1px solid #D4A373"}
};