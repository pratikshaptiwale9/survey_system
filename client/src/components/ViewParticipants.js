import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function ViewParticipants() {
  const navigate = useNavigate();

  const COLORS = {
    dark: "#3E2723",
    main: "#D4A373",
    secondary: "#8D6E63",
    light: "#FFF3E0",
    bg: "#FFF3E0",
    white: "#ffffff",
  };

  const [participants, setParticipants] = useState([]);
  const [surveys, setSurveys] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const res = await api.get("/participants");

        const list = Array.isArray(res.data)
          ? res.data.map((p) => ({
              ...p,
              id: p.id || p._id,
              surveyId: p.surveyId || p.survey_id,
            }))
          : [];

        const sortedParticipants = list.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setParticipants(sortedParticipants);
      } catch (err) {
        console.error("Error fetching participants:", err);
        setParticipants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, []);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const res = await api.get("/surveys");

        const map = {};
        if (Array.isArray(res.data)) {
          res.data.forEach((s) => {
            map[s.id || s._id] = s.title;
          });
        }

        setSurveys(map);
      } catch (err) {
        console.error("Error loading surveys:", err);
      }
    };

    fetchSurveys();
  }, []);

  const filteredParticipants = participants.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <img src="/logo.png" alt="logo" style={styles.logoImg} />

        <div style={styles.sidebarCenter}>
          <h1 style={styles.logo}>Participants</h1>

          <p style={styles.sidebarDesc}>
            View all participants and their
            survey details easily.
          </p>
        </div>

        <div style={styles.sidebarBottom}>
          {/* ✅ LOGOUT BUTTON */}
          <button style={styles.sideBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div
        style={{
          flex: 1,
          padding: 50,
          fontFamily: "Poppins, Arial, sans-serif",
          backgroundColor: COLORS.bg,
          overflowY: "auto"
        }}
      >

        {/* HEADER WITH TOP RIGHT BUTTON */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          <div>
            <h1 style={{ fontSize: 32, color: COLORS.dark }}>
              Participants
            </h1>
            <p style={{ color: COLORS.secondary }}>
              List of registered participants
            </p>
          </div>

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

        {/* SEARCH */}
        <div style={{ marginBottom: 25 }}>
          <input
            type="text"
            placeholder="Search participant by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 18px",
              borderRadius: 12,
              border: `2px solid ${COLORS.main}`,
              fontSize: 16,
              outline: "none",
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              backgroundColor: COLORS.white,
              color: COLORS.dark,
            }}
          />
        </div>

        {/* DATA */}
        {loading ? (
          <p style={{ color: COLORS.dark }}>Loading participants...</p>
        ) : filteredParticipants.length === 0 ? (
          <p style={{ color: COLORS.dark }}>No participants found.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 20,
            }}
          >
            {filteredParticipants.map((p) => (
              <div
                key={p.id}
                style={{
                  backgroundColor: COLORS.white,
                  padding: 25,
                  borderRadius: 16,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
                  borderLeft: `6px solid ${COLORS.main}`,
                  transition: "0.3s",
                }}
              >
                <h3 style={{ fontSize: 20, color: COLORS.dark }}>
                  {p.name}
                </h3>
                <p style={{ color: COLORS.dark }}>Age: {p.age}</p>
                <p style={{ color: COLORS.dark }}>Gender: {p.gender}</p>

                <p>
                  Survey:{" "}
                  <strong style={{ color: COLORS.secondary }}>
                    {surveys[p.surveyId] || "Unknown Survey"}
                  </strong>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "220px",
    background: "#3E2723",
    color: "#FFF3E0",
    padding: "25px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },

  logoImg: { width: "110px" },

  sidebarCenter: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },

  logo: {
    fontSize: "30px",
    fontWeight: "700",
    color: "#FFF3E0"
  },

  sidebarDesc: {
    fontSize: "13px",
    textAlign: "center",
    marginTop: "10px",
    opacity: "0.9",
    lineHeight: "1.4",
    padding: "0 5px",
    color: "#FFF3E0"
  },

  sidebarBottom: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    width: "100%"
  },

  sideBtn: {
    padding: "13px",
    borderRadius: "8px",
    border: "1px solid #D4A373",
    background: "transparent",
    color: "#FFF3E0",
    cursor: "pointer"
  }
};

export default ViewParticipants;