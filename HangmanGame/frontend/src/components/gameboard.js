import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./gameboard.css"; // Import the CSS file for styling

const Gameboard = ({ username }) => {
  const [word, setWord] = useState("");
  const [correctWord, setCorrectWord] = useState("");
  const [input, setInput] = useState("");
  const [numOfGuesses, setNumOfGuesses] = useState(0);
  const [correctGuesses, setCorrectGuesses] = useState(0);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [message, setMessage] = useState("");
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [gameEnded, setGameEnded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const intialMount = useRef(true);
  const [isResetting,setIsResetting] = useState(false);


  const setWordLength = (length) => {
    console.log("Word Length", length);
    localStorage.setItem("hangmanWordLength", length);
  };

  const handleCorrectWord = () => {
    localStorage.setItem("correctWord", correctWord);
  };

  const fetchWord = useCallback ( async () => {
    try {
      const response = await axios.get("http://localhost:4000/word");
      console.log ("hello");
      setWord(response.data.word);
      setWordLength(response.data.wordLength);
      setCorrectWord(response.data.actualword);
      setNumOfGuesses(0);
      setWrongGuesses(0);
      setMessage("");
      setGuessedLetters([]);
      setGameEnded(false);
    } catch (error) {
      console.error("Error fetching word:", error);
      setMessage("Error fetching word. Please try again.");
    }
  } , [] );

  useEffect(() => {
    if (intialMount.current) {
      fetchWord();
      intialMount.current = false;
    }
   
    
  }, [fetchWord]);
  useEffect(() => 
  {
    if (location.state?.reset && !isResetting){
      setIsResetting(true);
      resetGame();
    } }, [location.state, isResetting]);
    const resetGame = () => {
      fetchWord();
      setInput("");
      setGuessedLetters([]);
    };
  const handleLogout = () => {
    localStorage.removeItem("hangmanUsername"); // Remove username from localStorage
    navigate("/"); // Navigate back to login page
  };

  const handleGuess = async () => {
    try {
      const response = await axios.post("http://localhost:4000/guess", {
        guess: input.toLowerCase() // Ensure input is lowercase
      });
      setWord(response.data.word);
      setNumOfGuesses(response.data.numOfGuesses);
      setWrongGuesses(response.data.wrongGuesses);
      if (response.status === 200) {
        setMessage("Good guess!");
        setCorrectGuesses(correctGuesses + 1);
      } else if (response.status === 250) {
        setCorrectGuesses(correctGuesses + 1);
        setMessage("Congratulations! You've guessed the word!");
        const res1 = await axios.get("http://localhost:4000/username");
        const res2 = await axios.post("http://localhost:4000/scores", {
          username,
          score: numOfGuesses,
          wordLength: word.length
        });
        handleCorrectWord();
        console.log("Res 1", res1, "\n Res2", res2);
        setGameEnded(true);
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          setMessage("Incorrect guess.");
          setWrongGuesses(error.response.data.wrongGuesses);
          setNumOfGuesses(error.response.data.numOfGuesses);
        } else if (status === 450) {
          setMessage("Letter already guessed.");
        } else if (status === 451) {
          setMessage("Game over!");
          setWord(error.response.data.word);
          console.log("Game over!", word);
          const res1 = await axios.get("http://localhost:4000/username");
          const res2 = await axios.post("http://localhost:4000/scores", {
            username,
            score: numOfGuesses,
            wordLength: word.length
          });
          handleCorrectWord();
          console.log("Res 1", res1, "\n Res2", res2);
          setTimeout(function () {}, 2500);
          setGameEnded(true);
        } else {
          setMessage("An error occurred. Please try again.");
        }
      } else {
        setMessage("An error occurred. Please try again.");
      }
      setNumOfGuesses(error.response?.data?.numOfGuesses || numOfGuesses);
    } finally {
      setGuessedLetters([...guessedLetters, input]);
      setInput("");
    }
  };

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input && /^[a-zA-Z]$/.test(input)) {
      handleGuess();
    } else {
      setMessage("Please enter a valid letter.");
    }
  };

  const handleHighscore = () => { 
    navigate("/highscore");
  }

  return (
    <div className="app-container">
      <h1 className="game-title">Hangman Game</h1>
      <p className="game-info">Welcome, {username}!</p>
      <p className="word-display" style={{ textAlign: "center" }}>
        {word}
      </p>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={handleChange}
            maxLength="1"
            className="guess-input"
            required
          />
          <div className="guess-buttons">
            <button type="submit" className="guess-button">
              Guess
            </button>
            
          </div>
        </div>
      </form>

      <div className="game-stats">
        <p className="stat">Correct Guesses: {correctGuesses}</p>
        <p className="stat">Wrong Guesses: {wrongGuesses}</p>
        <p className="stat">Total Guesses: {numOfGuesses}</p>
        <p className="stat guessed-letters">
          Guessed Letters: {guessedLetters.join(", ")}
        </p>
        <p className="message">{message}</p>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {gameEnded && (
          <button onClick={handleHighscore} className="highscore-button">
          Top 10 Highscores
        </button>
        )}
        <button onClick={handleLogout} className="logout-button">
          Exit
        </button>
      </div>
    </div>
  );
};

export default Gameboard;
