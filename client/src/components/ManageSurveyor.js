import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function ManageSurveyor() {
  const navigate = useNavigate();

  const [surveyors, setSurveyors] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [newSurveyor, setNewSurveyor] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    fetchSurveyors();
  }, []);

  const fetchSurveyors = async () => {
    try {
      const res = await api.get("/surveyors");

      const list = Array.isArray(res.data)
        ? res.data.map((s) => ({
            id: s._id || s.id,
            name: s.name || "",
            email: s.email || "",
          }))
        : [];

      setSurveyors(list);
    } catch (err) {
      console.error("Error fetching surveyors:", err);
    }
  };

  const handleAddSurveyor = async (e) => {
    e.preventDefault();

    if (!newSurveyor.name || !newSurveyor.email || !newSurveyor.password) {
      return alert("Please fill all fields!");
    }

    try {
      const res = await api.post("/surveyors", newSurveyor);

      const created = res.data;

      setSurveyors((prev) => [
        ...prev,
        { id: created._id, name: created.name, email: created.email },
      ]);

      setNewSurveyor({ name: "", email: "", password: "" });
      setShowForm(false);
    } catch (err) {
      alert("Failed to add surveyor");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this surveyor?")) return;

    try {
      await api.delete(`/surveyors/${id}`);
      setSurveyors((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  // ✅ LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={styles.container}>
      
      {/* Sidebar */}

      <div style={styles.sidebar}>

        <img src="/logo.png" alt="logo" style={styles.logoImg} />

        <div style={styles.sidebarCenter}>
          <h2 style={styles.sidebarTitle}>Manage Surveyors</h2>

          <p style={styles.sidebarText}>
            Add and manage surveyors responsible for collecting field data.
          </p>
        </div>

        <div style={styles.sidebarButtons}>
          {/* ✅ LOGOUT BUTTON */}
          <button
            style={styles.sideBtn}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

      </div>

      {/* Main */}

      <div style={styles.main}>

        {/* Header */}

        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Surveyor Management</h2>
            <p style={styles.subtitle}>
              Create, manage, and monitor surveyors who collect participant responses.
            </p>
          </div>

          <button
            style={styles.addBtn}
            onClick={() => setShowForm(true)}
          >
            + Add Surveyor
          </button>
        </div>

        {/* Table */}

        <div style={styles.tableContainer}>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {surveyors.map((s) => (
                <tr key={s.id} style={styles.tr}>
                  <td style={styles.td}>{s.name}</td>
                  <td style={styles.td}>{s.email}</td>

                  <td style={styles.td}>

                    <button
                      style={styles.resultBtn}
                      onClick={() => navigate(`/analysis/${s.id}`)}
                    >
                      View Result
                    </button>

                    <button
                      style={styles.deleteBtn}
                      onClick={() => handleDelete(s.id)}
                    >
                      Delete
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>

        {/* Back */}

        <button
          onClick={() => navigate("/dashboard")}
          style={styles.backBtn}
        >
          Back to Dashboard
        </button>

      </div>

      {/* Modal */}

      {showForm && (
        <div style={styles.modalOverlay}>

          <div style={styles.modal}>

            <h3 style={styles.modalTitle}>Add New Surveyor</h3>

            <form onSubmit={handleAddSurveyor}>

              <input
                placeholder="Name"
                style={styles.input}
                value={newSurveyor.name}
                onChange={(e) =>
                  setNewSurveyor({ ...newSurveyor, name: e.target.value })
                }
              />

              <input
                placeholder="Email"
                style={styles.input}
                value={newSurveyor.email}
                onChange={(e) =>
                  setNewSurveyor({ ...newSurveyor, email: e.target.value })
                }
              />

              <input
                type="password"
                placeholder="Password"
                style={styles.input}
                value={newSurveyor.password}
                onChange={(e) =>
                  setNewSurveyor({ ...newSurveyor, password: e.target.value })
                }
              />

              <div style={styles.modalButtons}>

                <button type="submit" style={styles.saveBtn}>
                  Save
                </button>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={styles.cancelBtn}
                >
                  Cancel
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

/* STYLES */

const styles = {

container:{
display:"flex",
minHeight:"100vh",
fontFamily:"Segoe UI"
},

sidebar:{
width:"230px",
background:"#3E2723",
color:"#FFF3E0",
padding:"25px",
display:"flex",
flexDirection:"column",
alignItems:"center"
},

logoImg:{
width:"110px",
marginBottom:"30px"
},

sidebarCenter:{
flex:1,
display:"flex",
flexDirection:"column",
justifyContent:"center",
alignItems:"center",
textAlign:"center"
},

sidebarTitle:{
marginBottom:"10px",
color:"#FFF3E0"
},

sidebarText:{
fontSize:"13px",
opacity:"0.9",
color:"#FFF3E0"
},

sidebarButtons:{
marginTop:"auto",
width:"100%",
display:"flex",
flexDirection:"column",
gap:"12px"
},

sideBtn:{
padding:"12px",
borderRadius:"8px",
border:"1px solid #D4A373",
background:"transparent",
color:"#FFF3E0",
cursor:"pointer"
},

main:{
flex:1,
padding:"40px",
background:"#FFF3E0"
},

header:{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
marginBottom:"25px"
},

title:{
margin:0,
color:"#3E2723"
},

subtitle:{
fontSize:"14px",
color:"#8D6E63"
},

addBtn:{
background:"#3E2723",
color:"white",
padding:"12px 20px",
borderRadius:"10px",
border:"none",
cursor:"pointer"
},

tableContainer:{
background:"white",
borderRadius:"12px",
boxShadow:"0 4px 10px rgba(0,0,0,0.1)",
overflow:"hidden"
},

table:{
width:"100%",
borderCollapse:"collapse"
},

th:{
background:"#3E2723",
color:"white",
padding:"14px"
},

td:{
padding:"14px",
color:"#3E2723"
},

tr:{
borderBottom:"1px solid #eee"
},

resultBtn:{
background:"#8D6E63",
color:"white",
padding:"6px 12px",
borderRadius:"8px",
border:"none",
marginRight:"8px",
cursor:"pointer"
},

deleteBtn:{
background:"#D4A373",
color:"white",
padding:"6px 12px",
borderRadius:"8px",
border:"none",
cursor:"pointer"
},

backBtn:{
marginTop:"20px",
padding:"10px 18px",
background:"#3E2723",
color:"white",
border:"none",
borderRadius:"8px",
cursor:"pointer"
},

modalOverlay:{
position:"fixed",
inset:0,
background:"rgba(0,0,0,0.4)",
display:"flex",
justifyContent:"center",
alignItems:"center"
},

modal:{
background:"white",
padding:"30px",
borderRadius:"14px",
width:"350px"
},

modalTitle:{
marginBottom:"15px",
color:"#3E2723"
},

input:{
width:"100%",
padding:"10px",
marginBottom:"10px",
borderRadius:"8px",
border:"1px solid #ccc"
},

modalButtons:{
display:"flex",
gap:"10px"
},

saveBtn:{
background:"#3E2723",
color:"white",
padding:"8px 14px",
border:"none",
borderRadius:"8px"
},

cancelBtn:{
background:"#8D6E63",
color:"white",
padding:"8px 14px",
border:"none",
borderRadius:"8px"
}

};