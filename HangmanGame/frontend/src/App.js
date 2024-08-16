import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login";
import Game from "./components/gameboard";
import HighScore from "./components/high_scores";
import "./App.css";
const App = () => {
  const [username, setUsername] = useState(
    localStorage.getItem("hangmanUsername") || ""
  );
  return (
    <div className="container">
      <Router>
        <Routes>
          <Route path="/" element={<Login setUsername={setUsername} />} />
          <Route path="/game" element={<Game username={username} />} />
          <Route path="/highscore" element={<HighScore />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
