import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = ({ setUsername }) => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Check localStorage for existing username on component mount
  useEffect(() => {
    const storedUsername = localStorage.getItem("hangmanUsername");
    if (storedUsername) {
      setUsername(storedUsername);
      navigate("/game");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/backend_username",
        { name }
      );
      if (response.status === 200) {
        // Save username to localStorage
        localStorage.setItem("hangmanUsername", response.data);
        setUsername(response.data);
        navigate("/game");
      } else {
        setMessage("Invalid username. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting username:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h1>Enter Username</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
      <p className="message">{message}</p>
    </div>
  );
};

export default Login;
