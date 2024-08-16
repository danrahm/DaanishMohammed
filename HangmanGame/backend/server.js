const express = require('express'); // import express
const cors = require('cors'); // import cors
require('dotenv').config({path: "./config.env"}); // Load environment variables from a .env file into process.env
const dbo = require('./db/conn'); // connect to database
const app = express(); // create an express app
const port = process.env.PORT; // go to .env file and get the port number
const session = require('express-session');
const MongoStore = require('connect-mongo');


// Middleware
app.use(cors(
    {origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
        optionsSuccessStatus: 204,
        allowedHeaders: ['Content-Type', 'Authorization'],
    }
));

// session
app.use(session({
    secret: 'keyboard cat',
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({mongoUrl: process.env.ATLAS_URI}),
}))

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

// testing files