// HighScores.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Highscore.css"; // Import the CSS file for styling
import { useNavigate } from "react-router-dom";

const HighScores = () => {
  const [highScores, setHighScores] = useState([]);
  const [wordLength, setWordLength] = useState(
    localStorage.getItem("hangmanWordLength") || 0
  );
  const correctWord = localStorage.getItem("correctWord") || "";
  const navigate = useNavigate();

  useEffect(() => {
    if (wordLength) {
      fetchHighScoresForWordLength(wordLength); // Fetch high scores when wordLength prop changes
    }
  }, [wordLength]); // Re-fetch scores whenever wordLength prop changes

  const fetchHighScoresForWordLength = async (length) => {
    try {
      // Make an API request to fetch high scores based on word length
      const response = await axios.get(
        `http://localhost:4000/highscores/${length}`
      );
      setHighScores(response.data); // Update state with fetched scores
    } catch (error) {
      console.error("Error fetching high scores:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("hangmanUsername"); // Remove username from localStorage
    navigate("/"); // Navigate back to login page
  };
  const resetGame = () => {
    navigate("/game",{state:{reset:true}});
  };


  return (
    <div className="high-scores-container">
      <h1>High Scores</h1>
      <p>Word Length: {wordLength}</p>
      <p>Correct Word: {correctWord}</p>
      <table className="high-scores-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Guesses</th>
            <th>Word Length</th>
          </tr>
        </thead>
        <tbody>
          {highScores.map((score, index) => (
            <tr key={index}>
              <td>{score.username}</td>
              <td>{score.score}</td>
              <td>{score.wordLength}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: "flex", justifyContent: "center" }}>
      <button onClick={resetGame} className="reset-button">
              Restart Game
            </button>
        <button onClick={handleLogout} className="logout-button">
          Exit
        </button>
      </div>
    </div>
  );
};

export default HighScores;
