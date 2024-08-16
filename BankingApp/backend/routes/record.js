const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn");
const crypto = require('crypto');
const hash = crypto.getHashes();

// Used to login in the user and set up a session for them
// Status code 200: Session set
// Status code 400: User already has a session
recordRoutes.route("/session_set/:id").get(async function(req, res) {
    const userID = req.params.id;
    let status = "";
    if(!req.session.username) {
        // Sets the session if the user is not logged in already
        req.session.username = userID;
        status = "Session set";
        // saves the session object to the database
        const resultObj = {status: status};
        res.status(200).json(resultObj);
    } else {
        // Informs the front end the user is already logged in
        status = "user is already logged in";
        const resultObj = {status: status};
        res.status(400).json(resultObj);
    }
});

// Used to check if the user already has a session
// Status code 200: The user is logged in
// Status code 400: The user is logged out
recordRoutes.route("/session_get").get(async function (req, res) {
    let loggedIn = false;
    let status = "";
    if(!req.session.username) {
        // Informs the frontend the user is logged out
        status = "logged out";
    } else {
        // Sets the status to the users name 
        status = req.session.username;
        loggedIn = true;
    }
    const resultObj = {status: status};
    // If the user is logged in 
    if(loggedIn){
        // Returns ok with user name as a Json object
        res.status(200).json(resultObj);
    } else {
        // Returns an error with status being logged out
        res.status(400).json(resultObj);
    }

});

// Used to delete the user session and also logs out the user
// Returns a successful message about logging out
recordRoutes.route("/session_delete").get(async function (req, res) {
    req.session.destroy();
    let status = "User has been logged out successfully";
    const resultObj = {status: status};

    res.json(resultObj);
});

// Creates and adds user to the database
recordRoutes.route("/createUser").post(async (req, res) => {
    try{
        // Connects to the database
        let db_connect = dbo.getDb();

        // Randomly assigns and three digit ID
        let userID = Math.floor(Math.random() * 1000).toString();
        if(userID.length == 1){
            userID = "00" + userID;
        } else if(userID.length == 2) {
            userID = "0" + userID;
        }

        // Checks to if the id has already been used
        let userExists = await db_connect.collection("customers").findOne({id: userID});

        if(userExists){
            // Randomly generates a new id until it gets one not beeing used
            while(userExists){
                let userID = Math.floor(Math.random * 1000).toString();
                if(userID.length == 1){
                    userID = "00" + userID;
                } else if(userID.length == 2) {
                    userID = "0" + userID;
                }
        
                userExists = await db_connect.collection("customers").findOne({id: userID});
            }
        }
        let hashPwd = crypto.createHash('sha256').update(req.body.password).digest('hex');

        // Creates the json user object
        let user = {
            id: userID,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            password: hashPwd,
            role: req.body.role,
            accounts: {
                savings: 0,
                checking: 0,
                investment: 0,
            },
            transactions: [
                { account: 'savings', amount: 0, type: 'Deposit', date: new Date() },
                { account: 'checking', amount: 0, type: 'Deposit', date: new Date() },
                { account: 'investment', amount: 0, type: 'Deposit', date: new Date() }]
        }
        // Insert the user into the database
        const result = await db_connect.collection("customers").insertOne(user);
        res.json(user);
    } catch(err) {
        throw err;
    }
});

// Verifies user login information
// Status code 200: User is successfully
// Status code 400: User does not exists or login information is incorrect
recordRoutes.route("/userLogin").post(async (req, res) => {
    try {
        // Used to store the user information
        const userID = req.body.userID;
        const password = req.body.password;

        // Connects to the database
        let db_connect = dbo.getDb();
        // Check if the userID is in the database
        const user = await db_connect.collection("customers").findOne({id: userID});
        let hashPwd = crypto.createHash('sha256').update(password).digest('hex');
        if(user){
            // If the user exists in the database
            // Makes sure the password is correct

            if(user.password == hashPwd){
                res.status(200).send(user);
            } else {
                // If password is incorrect
                res.status(400).send("Error logging in");
            }
        } else {
            // If user doesn't exists
            res.status(400).send("Error logging in");
        }

    } catch (err) {
        throw err;
    }
});


// Gets the user from the database related to the session data
recordRoutes.route("/getUser").get(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        const options = { projection: {_id:0, password:0}};
        const user = await db_connect.collection("customers").findOne({id: req.session.username}, options);
        res.status(200).json(user);

    } catch (err) {
        throw err;
    }
});

// Updates the role of the user
// Status code 400: User doesn't exist
recordRoutes.route("/updateRole").post(async (req, res) => {
    try {
        // Used to store the user information
        const userID = req.body.userID;
        const role = req.body.role;

        //Connects to the database and checks if the user exists
        let db_connect = dbo.getDb();
        const user = await db_connect.collection("customers").findOne({id: userID});

        if(user){
            // If the user exists
            // Creates a query to update the user and a new role
            const query = {id: userID};
            const update = {
                $set: {
                    role: role
                },
            };
            // Updates the user in the database
            const result = await db_connect.collection("customers").updateOne(query, update);
            res.json(result);

        } else {
            res.status(400).send("User does not exists");
        }

    } catch (err) {
        throw err;
    }
});



// recordRoutes.route("/login").post(async (req, res) => {
//     try {
//         const { userName, password } = req.body;
//         // Dummy check for user credentials
//         if (userName === 'admin' && password === 'admin123') {
//             res.json({ role: 'Administrator', userName });
//         } else if (userName === 'customer' && password === 'customer123') {
//             res.json({ role: 'Customer', userName });
//         } else if (userName === 'employee' && password === 'employee123') {
//             res.json({ role: 'Employee', userName });
//         } else {
//             res.status(400).json({ message: 'Invalid login' });
//         }
//     } catch (err) {
//         throw err;
//     }
// });

// Test for customer part of app
// dummy data for now
let customers = {
    '123': {
        id: '123',
        firstName: 'John',
        lastName: 'Doe',
        accounts: {
            savings: 0,
            checking: 0,
            investment: 0,
        },
        transactions: [ // testing initial transactions
            { account: 'savings', amount: 0, type: 'Deposit', date: new Date() },
            { account: 'checking', amount: 0, type: 'Deposit', date: new Date() },
            { account: 'investment', amount: 0, type: 'Deposit', date: new Date() }
        ]
    } ,
    '231': {
        id: '231',
        firstName: 'J',
        lastName: 'D',
        accounts: {
            savings: 0,
            checking: 0,
            investment: 0,
        },
        transactions: [ // testing initial transactions
            { account: 'savings', amount: 0, type: 'Deposit', date: new Date() },
            { account: 'checking', amount: 0, type: 'Deposit', date: new Date() },
            { account: 'investment', amount: 0, type: 'Deposit', date: new Date() }
        ]
    }
};

// Get customer data
recordRoutes.route("/customer").get(async (req, res) => {
    try {
        if (!req.session.username) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const customerID = req.session.username;
        let db_connect = dbo.getDb();
        const customer = await db_connect.collection("customers").findOne({ id: customerID });
        if (customer) {
            res.json(customer);
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Deposit money into account
recordRoutes.route("/customer/deposit").post(async (req, res) => {
    try {
        if (!req.session.username) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const customerID = req.session.username;
        const { account, amount } = req.body;

        let db_connect = dbo.getDb();
        const customer = await db_connect.collection("customers").findOne({ id: customerID });
        if (customer) {
            customer.accounts[account] += amount;
            customer.transactions.push({ account, amount, type: 'Deposit', date: new Date() });
            await db_connect.collection("customers").updateOne({ id: customerID }, { $set: customer });
            res.json(customer);
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Withdraw money from account
recordRoutes.route("/customer/withdraw").post(async (req, res) => {
    try {
        if (!req.session.username) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const customerID = req.session.username;
        const { account, amount } = req.body;

        let db_connect = dbo.getDb();
        const customer = await db_connect.collection("customers").findOne({ id: customerID });
        if (customer) {
            if (customer.accounts[account] < amount) {
                res.status(400).json({ message: 'Not enough money for withdrawal!' });
            } else {
                customer.accounts[account] -= amount;
                customer.transactions.push({ account, amount, type: 'Withdraw', date: new Date() });
                await db_connect.collection("customers").updateOne({ id: customerID }, { $set: customer });
                res.json(customer);
            }
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Transfer money between accounts
recordRoutes.route("/customer/transfer").post(async (req, res) => {
    try {
        if (!req.session.username) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const customerID = req.session.username;
        const { fromAccount, toAccount, amount } = req.body;

        let db_connect = dbo.getDb();
        const customer = await db_connect.collection("customers").findOne({ id: customerID });

        if (customer) {
            if (customer.accounts[fromAccount] < amount) {
                res.status(400).json({ message: 'Not enough money for transfer!' });
            } else {
                customer.accounts[fromAccount] -= amount;
                customer.accounts[toAccount] += amount;

                const transactionDate = new Date();
                customer.transactions.push({ account: fromAccount, amount, type: 'Outgoing Transfer', date: transactionDate });
                customer.transactions.push({ account: toAccount, amount, type: 'Incoming Transfer', date: transactionDate });

                await db_connect.collection("customers").updateOne({ id: customerID }, { $set: customer });

                res.json(customer);
            }
        } else {
            res.status(400).json({ message: 'Invalid customer details' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// clear all data (I did this for testing purposes)
recordRoutes.route("/customer/clearTransactions").post(async (req, res) => {
    try {
        if (!req.session.username) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const customerID = req.session.username;

        let db_connect = dbo.getDb();
        const customer = await db_connect.collection("customers").findOne({ id: customerID });

        if (customer) {
            customer.transactions = [];
            customer.accounts.savings = 0;
            customer.accounts.checking = 0;
            customer.accounts.investment = 0;
            await db_connect.collection("customers").updateOne({ id: customerID }, { $set: customer });
            res.json(customer);
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

recordRoutes.route("/customer/:customerId").get(async (req, res) => {
    try {
        if (!req.session.username) {
            return res.status(401).json({ message: "Unauthorized" });
        }  
        const customerID = req.params.customerId;
        let db_connect = dbo.getDb();
        const customer = await db_connect.collection("customers").findOne({ id: customerID });
        if (customer) {
            res.json(customer);
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Deposit money into account
recordRoutes.route("/customer/:customerId/deposit").post(async (req, res) => {
    try {
        if (!req.session.username) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const customerID = req.params.customerId;
        const { account, amount } = req.body;

        let db_connect = dbo.getDb();
        const customer = await db_connect.collection("customers").findOne({ id: customerID });
        if (customer) {
            customer.accounts[account] += amount;
            customer.transactions.push({ account, amount, type: 'Deposit', date: new Date() });
            await db_connect.collection("customers").updateOne({ id: customerID }, { $set: customer });
            res.json(customer);
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

recordRoutes.route("/customer/:customerId/withdraw").post(async (req, res) => {
    try {
        if (!req.session.username) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const customerID = req.params.customerId;
        const { account, amount } = req.body;

        let db_connect = dbo.getDb();
        const customer = await db_connect.collection("customers").findOne({ id: customerID });
        if (customer) {
            if (customer.accounts[account] < amount) {
                res.status(400).json({ message: 'Not enough money for withdrawal!' });
            } else {
                customer.accounts[account] -= amount;
                customer.transactions.push({ account, amount, type: 'Withdraw', date: new Date() });
                await db_connect.collection("customers").updateOne({ id: customerID }, { $set: customer });
                res.json(customer);
            }
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Transfer money between accounts
recordRoutes.route("/customer/:customerId/transfer").post(async (req, res) => {
    try {
        if (!req.session.username) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const customerID = req.params.customerId;
        const { fromAccount, targetCustomerId, amount } = req.body;

        let db_connect = dbo.getDb();
        const customer = await db_connect.collection("customers").findOne({ id: customerID });
        const tCustomer= await db_connect.collection("customers").findOne({ id: targetCustomerId });

        if (customer && tCustomer) {
            if (customer.accounts[fromAccount] < amount) {
                res.status(400).json({ message: 'Not enough money for transfer!' });
            } else {
                customer.accounts[fromAccount] -= amount;
                tCustomer.accounts[fromAccount] += amount;
                const transactionDate = new Date();
                customer.transactions.push({ account: fromAccount, amount, type: 'Outgoing Transfer', date: transactionDate });
                tCustomer.transactions.push({ account: fromAccount, amount, type: 'Incoming Transfer', date: transactionDate });

                await db_connect.collection("customers").updateOne({ id: customerID }, { $set: customer });
                await db_connect.collection("customers").updateOne({ id: targetCustomerId }, { $set: tCustomer });

                res.json(customer);
            }
        } else {
            res.status(400).json({ message: 'Invalid customer details' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});




module.exports = recordRoutes;










































































module.exports = recordRoutes;