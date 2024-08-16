const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const User = require('../models/user');
const router = express.Router();

// Middleware to parse JSON
router.use(express.json());

// Use session middleware
router.use(session({
    secret: 'danish_001',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://dbtalha:dbtalha@cluster0.lh3qvxz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
        collectionName: 'sessions'
    }),
    cookie: {
        httpOnly: true, // Restrict cookie access to HTTP(S) only
        secure: false, // Set to true in production with HTTPS
        maxAge: 180 * 60 * 1000, // 3 hours
    },// 3 hours
}));

// Create a new account
router.post('/create', async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        const newUser = new User({ firstName, lastName, email, phoneNumber, password });
        await newUser.save();
        res.json({ message: 'Account created successfully!' });
    } catch (error) {
        res.status(400).json({ message: 'Error creating account', error: error.message });
    }
});

// Check email/password pair and login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (user) {
            // Set userId in session upon successful login
            req.session.userId = user._id; // Assuming user._id is MongoDB ObjectId
            res.json({ message: 'Login successful!', userId: user._id }); // Sending userId back to frontend
        } else {
            res.status(400).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error logging in', error: error.message });
    }
});

// Logout user
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(400).json({ message: 'Error logging out', error: err.message });
        }
        res.json({ message: 'Logout successful!' });
    });
});

// Retrieve all user accounts
router.get('/users', async (req, res) => {
    try {
        // Check if user is logged in
        if (!req.session.userId) {
            return res.status(401).json({ message: 'Unauthorized: Please log in' });
        }

        const users = await User.find({}, '-password');
        res.json(users);
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving users', error: error.message });
    }
});

// Retrieve one account by email
router.post('/user', async (req, res) => {
    try {
        // Check if user is logged in
        if (!req.session.userId) {
            return res.status(401).json({ message: 'Unauthorized: Please log in' });
        }
        const { email } = req.body;
        const user = await User.findOne({ email }, '-password');
        if (user) {
            res.json(user);
        } else {
            res.status(400).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving user', error: error.message });
    }
});


// Update account role
router.post('/update-role', async (req, res) => {
    try {
        // Check if user is logged in
        if (!req.session.userId) {
            return res.status(401).json({ message: 'Unauthorized: Please log in' });
        }

        const { userId, email, role } = req.body;


        const user = await User.findOneAndUpdate({ email }, { role }, { new: true });
        if (user) {
            res.json({ message: 'Role updated successfully!', user });
        } else {
            res.status(400).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error updating role', error: error.message });
    }
});

// Deposit money
router.post('/deposit', async (req, res) => {
    try {
        // Check if user is logged in
        if (!req.session.userId) {
            return res.status(401).json({ message: 'Unauthorized: Please log in' });
        }

        const { userId, amount, accountType } = req.body;


        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (accountType === 'checking') {
            user.checking += amount;
        } else if (accountType === 'savings') {
            user.savings += amount;
        } else {
            return res.status(400).json({ message: 'Invalid account type' });
        }

        await user.save();
        res.json({ message: 'Deposit successful!', user });
    } catch (error) {
        res.status(400).json({ message: 'Error depositing money', error: error.message });
    }
});

// Withdraw money
router.post('/withdraw', async (req, res) => {
    try {
        // Check if user is logged in
        if (!req.session.userId) {
            return res.status(401).json({ message: 'Unauthorized: Please log in' });
        }

        const { userId, amount, accountType } = req.body;


        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (accountType === 'checking') {
            if (user.checking >= amount) {
                user.checking -= amount;
            } else {
                return res.status(400).json({ message: 'Insufficient funds' });
            }
        } else if (accountType === 'savings') {
            if (user.savings >= amount) {
                user.savings -= amount;
            } else {
                return res.status(400).json({ message: 'Insufficient funds' });
            }
        } else {
            return res.status(400).json({ message: 'Invalid account type' });
        }

        await user.save();
        res.json({ message: 'Withdrawal successful!', user });
    } catch (error) {
        res.status(400).json({ message: 'Error withdrawing money', error: error.message });
    }
});

// Transfer money between accounts
router.post('/transfer', async (req, res) => {
    try {
        // Check if user is logged in
        if (!req.session.userId) {
            return res.status(401).json({ message: 'Unauthorized: Please log in' });
        }

        const { userId, amount, fromAccount, toAccount } = req.body;


        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (fromAccount === 'checking' && toAccount === 'savings') {
            if (user.checking >= amount) {
                user.checking -= amount;
                user.savings += amount;
            } else {
                return res.status(400).json({ message: 'Insufficient funds' });
            }
        } else if (fromAccount === 'savings' && toAccount === 'checking') {
            if (user.savings >= amount) {
                user.savings -= amount;
                user.checking += amount;
            } else {
                return res.status(400).json({ message: 'Insufficient funds' });
            }
        } else {
            return res.status(400).json({ message: 'Invalid account types' });
        }

        await user.save();
        res.json({ message: 'Transfer successful!', user });
    } catch (error) {
        res.status(400).json({ message: 'Error transferring money', error: error.message });
    }
});

module.exports = router;
