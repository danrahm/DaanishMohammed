const express = require('express'); // import express
const cors = require('cors'); // import cors
require('dotenv').config({path: "./config.env"}); // Load environment variables from a .env file into process.env
const dbo = require('./db/conn'); // connect to database
const app = express(); // create an express app
const port = process.env.PORT; // go to .env file and get the port number

// Middleware
app.use(cors());
app.use(express.json());
app.use(require('./routes/record')); // use the record.js file to handle the routes

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    dbo.connectToServer(function(err) {
        if (err) {
            console.error(err);
        }
    });
    console.log(`Server is running on port: ${port}`);
});
