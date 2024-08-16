const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo');
const cors = require('cors'); // Import cors package
const accountRoutes = require('./routes/account');

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(bodyParser.json());
// Use cors middleware
// CORS configuration
const corsOptions = {
    origin: 'http://localhost:3001', // Replace with your frontend URL
    credentials: true, // Allow cookies and authorization headers with CORS requests
};
app.use(cors(corsOptions))
// MongoDB Atlas connection string
const mongoURI = 'mongodb+srv://dbtalha:dbtalha@cluster0.lh3qvxz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Configure session
app.use(session({
    secret: 'danish_001', 
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: mongoURI }),
     cookie: {
        httpOnly: true, // Restrict cookie access to HTTP(S) only
        secure: false, // Set to true in production with HTTPS
        maxAge: 180 * 60 * 1000, // 3 hours
    },
}));

// Use account routes
app.use('/account', accountRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
