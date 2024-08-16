const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn");

let word = "";
let frontEndString = "";
let correctGuesses = "";
let numOfGuesses = 0;
let wrongGuesses = 0;
let username = "";
let letterCount = 0;

// Fetch a random word from the database
recordRoutes.route("/word").get(async (req, res) => {
  try {
    resetGameVariables();

    let db_connect = dbo.getDb();
    const words = await db_connect.collection("WordBank").find({}).toArray();
    const randomIndex = Math.floor(Math.random() * words.length);
    word = words[randomIndex].word;
    letterCount = word.length;

    for (let i = 0; i < word.length; i++) {
      frontEndString += "_ ";
    }

    res.json({
      word: frontEndString,
      wordLength: letterCount,
      actualword: word
    });
    console.log(word);
  } catch (err) {
    console.error("Error fetching word:", err);
    res.status(500).json({ message: "Error fetching word. Please try again." });
  }
});

// Handles the user guess and game logic for the game
// Status (200) User guess is good and valid
// Status (250) User as got all letter guessed correctly
// Status (400) letter is not contained in the word
// Status (450) Letter is already guessed
// Status (451) User uses up there guess and game over
recordRoutes.route("/guess").post(async (req, res) => {
  try {
    const userGuess = req.body.guess.toLowerCase();

    if (
      correctGuesses.includes(userGuess) ||
      frontEndString.includes(userGuess)
    ) {
      return res.status(450).json({ message: "Letter already guessed." });
    }

    numOfGuesses++;

    if (word.includes(userGuess)) {
      correctGuesses += userGuess;
      frontEndString = updateFrontEndString();

      if (!frontEndString.includes("_")) {
        return res.status(250).json({
          word: frontEndString,
          numOfGuesses,
          wrongGuesses
        });
      }

      res.status(200).json({
        word: frontEndString,
        numOfGuesses,
        wrongGuesses
      });
    } else {
      wrongGuesses++;
      if (wrongGuesses >= 6) {
        // Assuming 6 wrong guesses lead to game over
        return res.status(451).json({
          word,
          numOfGuesses,
          wrongGuesses
        });
      }
      res.status(400).json({
        message: "Incorrect guess.",
        numOfGuesses,
        wrongGuesses
      });
    }
  } catch (err) {
    console.error("Error handling guess:", err);
    res.status(500).json({ message: "An error occurred. Please try again." });
  }
});

// Store the score in the database
recordRoutes.route("/scores").post(async (req, res) => {
  try {
      username = req.body.username;
      let score = numOfGuesses;
      let wordLength = letterCount
    let db_connect = dbo.getDb();
    let newScore = {
      username,
      score,
      wordLength
    };
    await db_connect.collection("Scores").insertOne(newScore);
    res.status(200).send("Score added to the database");
  } catch (err) {
    console.error("Error storing score:", err);
    res.status(500).json({ message: "Error storing score. Please try again." });
  }
});

// Get the high score board for a specific word length
recordRoutes.route("/highscores/:wordLength").get(async (req, res) => {
  try {
    const length = parseInt(req.params.wordLength);
    let db_connect = dbo.getDb();
    const scores = await db_connect
      .collection("Scores")
      .find({ wordLength: length })
      .sort({ score: 1 })
      .limit(10)
      .toArray();
    res.status(200).json(scores);
  } catch (err) {
    console.error("Error fetching high scores:", err);
    res
      .status(500)
      .json({ message: "Error fetching high scores. Please try again." });
  }
});

// Store the username in the backend
recordRoutes.route("/backend_username").post((req, res) => {
  try {
    username = req.body.name;
    res.status(200).send(username);
  } catch (err) {
    console.error("Error storing username:", err);
    res
      .status(500)
      .json({ message: "Error storing username. Please try again." });
  }
});

// Get the username from the session
recordRoutes.route("/username").get((req, res) => {
  try {
    req.session.username = username;
    res.status(200).send(username);
  } catch (err) {
    console.error("Error fetching username:", err);
    res
      .status(500)
      .json({ message: "Error fetching username. Please try again." });
  }
});

const resetGameVariables = () => {
  word = "";
  frontEndString = "";
  correctGuesses = "";
  numOfGuesses = 0;
  wrongGuesses = 0;
  letterCount = 0;
};

const updateFrontEndString = () => {
  let updatedString = "";
  for (let i = 0; i < word.length; i++) {
    if (correctGuesses.includes(word[i])) {
      updatedString += word[i] + " ";
    } else {
      updatedString += "_ ";
    }
  }
  return updatedString;
};

module.exports = recordRoutes;
