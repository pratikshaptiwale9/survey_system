import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";

/* ---------------- COLORS BASED ON RATING ---------------- */
const ratingColors = {
  1: "green",
  2: "yellow",
  3: "orange",
  4: "red",
};

/* ---------------- CREATE COLORED ICON ---------------- */
const createIcon = (color) =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

export default function Analysis() {
  const navigate = useNavigate();
  const { surveyorId } = useParams();

  const COLORS = {
    dark: "#3E2723",
    main: "#D4A373",
    secondary: "#8D6E63",
    light: "#FFE0B2",
    bg: "#FFF3E0",
    white: "#ffffff",
  };

  const [participantsData, setParticipantsData] = useState({});
  const [questionsMap, setQuestionsMap] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const qRes = await api.get("/questions");

        const qMap = {};
        (qRes.data || []).forEach((surveyBlock) => {
          (surveyBlock.Questions || []).forEach((q) => {
            qMap[String(q.Qno)] = q.Text;
          });
        });

        setQuestionsMap(qMap);

        const pRes = await api.get("/participants");

        const participantMap = {};
        (pRes.data || []).forEach((p) => {
          const id = String(p.id || p._id);
          participantMap[id] = p.name;
        });

        const analysisRes = await api.get(`/analysis/${surveyorId}`);

        const grouped = {};

        Object.entries(analysisRes.data || {}).forEach(([pid, pdata]) => {
          if (!pdata.cycles || pdata.cycles.length === 0) return;

          grouped[pid] = {
            name: pdata.name || participantMap[pid] || "Unknown",
            baseLat: pdata.cycles[0]?.lat || 0,
            baseLng: pdata.cycles[0]?.lng || 0,
            cycles: (pdata.cycles || []).map((cycle) => ({
              lat: cycle.lat || 0,
              lng: cycle.lng || 0,
              timestamp: cycle.timestamp || "",
              status:
                cycle.status ||
                pdata.status ||
                analysisRes.data?.status ||
                "Unknown",
              answers: (cycle.answers || []).map((ans) => ({
                questionNo: ans.questionNo,
                answer: ans.answer || "No answer",
                rating: ans.rating || 0,
              })),
            })),
            activeCycle: 0,
            activeQuestion: 0,
          };
        });

        setParticipantsData(grouped);
      } catch (err) {
        console.error("Error loading analysis data:", err);
      }
    };

    loadData();
  }, [surveyorId]);

  const changeCycle = (pid, direction) => {
    setParticipantsData((prev) => {
      const updated = { ...prev };
      const p = updated[pid];
      if (!p) return updated;

      const newIndex = p.activeCycle + direction;

      if (newIndex >= 0 && newIndex < p.cycles.length) {
        p.activeCycle = newIndex;
        p.activeQuestion = 0;
      }

      return { ...updated };
    });
  };

  const changeQuestion = (pid, direction) => {
    setParticipantsData((prev) => {
      const updated = { ...prev };
      const p = updated[pid];

      if (!p) return updated;

      const currentCycle = p.cycles[p.activeCycle];

      if (!currentCycle || !currentCycle.answers) return updated;

      const newIndex = p.activeQuestion + direction;

      if (newIndex >= 0 && newIndex < currentCycle.answers.length) {
        p.activeQuestion = newIndex;
      }

      return { ...updated };
    });
  };

  const participantsArray = Object.entries(participantsData);

  if (participantsArray.length === 0) {
    return (
      <div
        style={{
          padding: 40,
          backgroundColor: COLORS.bg,
          minHeight: "100vh",
          fontFamily: "Poppins, Arial",
          color: COLORS.dark,
        }}
      >
        No data found
      </div>
    );
  }

  const firstParticipant = participantsArray[0][1];
  const firstCycle = firstParticipant.cycles[firstParticipant.activeCycle];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        backgroundColor: COLORS.bg,
        fontFamily: "Poppins, Arial",
      }}
    >
      <MapContainer
        center={[firstCycle.lat, firstCycle.lng]}
        zoom={18}
        maxZoom={22}
        scrollWheelZoom={true}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 20,
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
          maxZoom={22}
        />

        {participantsArray.map(([pid, pdata]) => {
          const currentCycle = pdata.cycles[pdata.activeCycle];

          if (!currentCycle || !currentCycle.answers.length) return null;

          const currentAnswer =
            currentCycle.answers[pdata.activeQuestion];

          return (
            <Marker
              key={pid}
              position={[pdata.baseLat, pdata.baseLng]}
              icon={createIcon(
                ratingColors[currentAnswer?.rating] || "grey"
              )}
            >
              <Popup>
                <div
                  style={{
                    backgroundColor: COLORS.bg,
                    padding: 18,
                    borderRadius: 16,
                    minWidth: 260,
                    color: COLORS.dark,
                    border: `1px solid ${COLORS.main}`,
                    boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
                    fontFamily: "Poppins, Arial",
                    lineHeight: 1.4,
                  }}
                >
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ fontWeight: "600", fontSize: 15 }}>
                      Participant:
                      <span style={{ fontWeight: "500" }}>
                        {" "}
                        {pdata.name}
                      </span>
                    </div>

                    <div
                      style={{
                        color: COLORS.secondary,
                        fontSize: 13,
                      }}
                    >
                      Cycle {pdata.activeCycle + 1} of{" "}
                      {pdata.cycles.length}
                    </div>
                  </div>

                  <div style={{ marginTop: 10 }}>
                    <div style={{ fontWeight: "600" }}>
                      Question
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        color: COLORS.secondary,
                      }}
                    >
                      {questionsMap[
                        currentAnswer.questionNo
                      ] || "Unknown Question"}
                    </div>
                  </div>

                  <div style={{ marginTop: 8 }}>
                    <div style={{ fontWeight: "600" }}>Answer</div>
                    <div
                      style={{
                        fontSize: 14,
                        color: COLORS.secondary,
                      }}
                    >
                      {currentAnswer.answer}
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ fontWeight: "600" }}>
                      Rating: {currentAnswer.rating}
                    </div>

                    {/* ✅ UPDATED STATUS COLOR */}
                    <div
                      style={{
                        backgroundColor:
                          currentCycle.status ===
                          "Significant Improvement"
                            ? "#2e7d32"
                            : currentCycle.status ===
                              "Slight Improvement"
                            ? "#66bb6a"
                            : currentCycle.status === "No Change"
                            ? "#f9a825"
                            : currentCycle.status ===
                              "Slight Decline"
                            ? "#ef6c00"
                            : "#c62828",
                        color: "#fff",
                        padding: "4px 12px",
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {currentCycle.status}
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: 10,
                      fontSize: 13,
                      color: COLORS.secondary,
                    }}
                  >
                    {currentCycle.timestamp
                      ? new Date(
                          currentCycle.timestamp
                        ).toLocaleString()
                      : "Unknown time"}
                  </div>

                  <div
                    style={{
                      marginTop: 14,
                      textAlign: "center",
                      fontWeight: 600,
                      color: COLORS.secondary,
                    }}
                  >
                    Question {pdata.activeQuestion + 1} of{" "}
                    {currentCycle.answers.length}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 10,
                    }}
                  >
                    <button
                      disabled={pdata.activeQuestion === 0}
                      style={{
                        background: COLORS.main,
                        color: COLORS.white,
                        border: "none",
                        padding: "6px 14px",
                        borderRadius: 10,
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                      onClick={() => changeQuestion(pid, -1)}
                    >
                      ◀ Prev
                    </button>

                    <button
                      disabled={
                        pdata.activeQuestion ===
                        currentCycle.answers.length - 1
                      }
                      style={{
                        background: COLORS.main,
                        color: COLORS.white,
                        border: "none",
                        padding: "6px 14px",
                        borderRadius: 10,
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                      onClick={() => changeQuestion(pid, 1)}
                    >
                      Next ▶
                    </button>
                  </div>

                  <hr style={{ margin: "14px 0" }} />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <button
                      disabled={pdata.activeCycle === 0}
                      style={{
                        background: COLORS.dark,
                        color: "#fff",
                        border: "none",
                        padding: "6px 14px",
                        borderRadius: 10,
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                      onClick={() => changeCycle(pid, -1)}
                    >
                      ◀ Older
                    </button>

                    <button
                      disabled={
                        pdata.activeCycle ===
                        pdata.cycles.length - 1
                      }
                      style={{
                        background: COLORS.dark,
                        color: "#fff",
                        border: "none",
                        padding: "6px 14px",
                        borderRadius: 10,
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                      onClick={() => changeCycle(pid, 1)}
                    >
                      Newer ▶
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <button
        onClick={() => navigate("/dashboard")}
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          background: COLORS.dark,
          color: COLORS.bg,
          border: "none",
          padding: "14px 28px",
          borderRadius: "30px",
          fontSize: "16px",
          fontWeight: "600",
          cursor: "pointer",
          boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
          zIndex: 1000,
        }}
      >
        Back to Dashboard
      </button>
    </div>
  );
}