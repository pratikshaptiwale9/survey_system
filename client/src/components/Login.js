import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";   // 👈 keep this

function Login() {
  const navigate = useNavigate();

  // 🎨 Your template colors
  const COLORS = {
    dark: "#3E2723",
    main: "#D4A373",
    secondary: "#8D6E63",
    light: "#FFE0B2",
    bg: "#FFF3E0",
    white: "#ffffff",
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.get(
        "https://survey-api-iuq9.onrender.com/admins"
      );

      const users = res.data;

      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        localStorage.setItem("auth_user", JSON.stringify(user));
        navigate("/dashboard");
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: `linear-gradient(135deg, ${COLORS.dark}, ${COLORS.main})`,
        fontFamily: "Poppins, Arial, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: COLORS.bg,
          padding: "40px 50px",
          borderRadius: 20,
          boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
          minWidth: 350,
          textAlign: "center",
        }}
      >
        {/* 👇 Company Logo */}
        <img
          src="/logo.png"
          alt="Company Logo"
          style={{
            width: 120,
            marginBottom: 20,
          }}
        />

        <h2 style={{ marginBottom: 25, color: COLORS.dark }}>
          Login
        </h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              margin: "10px 0",
              borderRadius: 10,
              border: `1px solid ${COLORS.secondary}`,
              outline: "none",
            }}
            required
          />

          <input
            type="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              margin: "10px 0",
              borderRadius: 10,
              border: `1px solid ${COLORS.secondary}`,
              outline: "none",
            }}
            required
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 10,
              fontSize: 14,
              color: COLORS.dark,
            }}
          >
            <label>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                style={{ marginRight: 6 }}
              />
              Remember Me
            </label>

            <button
              type="button"
              onClick={() =>
                alert("Password reset link sent to your email!")
              }
              style={{
                background: "none",
                border: "none",
                color: COLORS.secondary,
                cursor: "pointer",
                textDecoration: "underline",
                fontSize: 14,
              }}
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: 12,
              marginTop: 20,
              borderRadius: 14,
              border: "none",
              cursor: "pointer",
              background: `linear-gradient(135deg, ${COLORS.dark}, ${COLORS.secondary})`,
              color: COLORS.white,
              fontWeight: "bold",
              fontSize: 16,
              boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;