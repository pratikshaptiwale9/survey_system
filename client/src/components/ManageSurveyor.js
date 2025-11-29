import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ManageSurveyor() {
  const navigate = useNavigate();

  const [surveyors, setSurveyors] = useState([
    { id: "S001", name: "John Doe", email: "john@example.com", status: "Active" },
    { id: "S002", name: "Priya Sharma", email: "priya@example.com", status: "Inactive" },
    { id: "S003", name: "David Kim", email: "david@example.com", status: "Active" },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newSurveyor, setNewSurveyor] = useState({
    id: "",
    name: "",
    email: "",
    status: "Active",
  });

  const handleAddSurveyor = (e) => {
    e.preventDefault();
    if (!newSurveyor.id || !newSurveyor.name || !newSurveyor.email) {
      alert("Please fill all fields!");
      return;
    }
    setSurveyors([...surveyors, newSurveyor]);
    setNewSurveyor({ id: "", name: "", email: "", status: "Active" });
    setShowForm(false);
  };

  const toggleStatus = (index) => {
    const updated = [...surveyors];
    updated[index].status = updated[index].status === "Active" ? "Inactive" : "Active";
    setSurveyors(updated);
  };

  const deleteSurveyor = (index) => {
    const updated = surveyors.filter((_, i) => i !== index);
    setSurveyors(updated);
  };

  // --- Styles ---
  const containerStyle = {
    padding: "30px",
    backgroundColor: "#f8f9fc",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  };

  const thStyle = {
    backgroundColor: "#4e73df",
    color: "#fff",
    textAlign: "left",
    padding: "12px",
    fontSize: "16px",
  };

  const tdStyle = {
    padding: "12px",
    borderBottom: "1px solid #ddd",
  };

  const addButtonStyle = {
    backgroundColor: "#1cc88a",
    color: "#fff",
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    marginBottom: "20px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
  };

  const backButtonStyle = {
    backgroundColor: "#4e73df",
    color: "#fff",
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "20px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
  };

  const actionButtonStyle = {
    padding: "6px 10px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    marginRight: "8px",
  };

  const modalOverlay = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };

  const modalContent = {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "12px",
    width: "400px",
    boxShadow: "0 6px 10px rgba(0,0,0,0.2)",
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ color: "#2e59d9", marginBottom: "20px" }}>Manage Surveyors</h2>

      <button style={addButtonStyle} onClick={() => setShowForm(true)}>
        + Add New Surveyor
      </button>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Surveyor ID</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {surveyors.map((s, index) => (
            <tr key={index}>
              <td style={tdStyle}>{s.id}</td>
              <td style={tdStyle}>{s.name}</td>
              <td style={tdStyle}>{s.email}</td>
              <td style={tdStyle}>
                <span
                  style={{
                    padding: "6px 10px",
                    borderRadius: "6px",
                    color: "#fff",
                    backgroundColor: s.status === "Active" ? "#1cc88a" : "#e74a3b",
                  }}
                >
                  {s.status}
                </span>
              </td>
              <td style={tdStyle}>
                <button
                  style={{
                    ...actionButtonStyle,
                    backgroundColor: "#36b9cc",
                    color: "#fff",
                  }}
                  onClick={() => toggleStatus(index)}
                >
                  Toggle
                </button>
                <button
                  style={{
                    ...actionButtonStyle,
                    backgroundColor: "#e74a3b",
                    color: "#fff",
                  }}
                  onClick={() => deleteSurveyor(index)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Back Button */}
      <button style={backButtonStyle} onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>

      {/* Modal Form */}
      {showForm && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3 style={{ color: "#2e59d9", marginBottom: "15px" }}>Add New Surveyor</h3>
            <form onSubmit={handleAddSurveyor}>
              <label>ID:</label>
              <input
                type="text"
                value={newSurveyor.id}
                onChange={(e) =>
                  setNewSurveyor({ ...newSurveyor, id: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
              <label>Name:</label>
              <input
                type="text"
                value={newSurveyor.name}
                onChange={(e) =>
                  setNewSurveyor({ ...newSurveyor, name: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
              <label>Email:</label>
              <input
                type="email"
                value={newSurveyor.email}
                onChange={(e) =>
                  setNewSurveyor({ ...newSurveyor, email: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
              <label>Status:</label>
              <select
                value={newSurveyor.status}
                onChange={(e) =>
                  setNewSurveyor({ ...newSurveyor, status: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "20px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    backgroundColor: "#6c757d",
                    color: "#fff",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#4e73df",
                    color: "#fff",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageSurveyor;
