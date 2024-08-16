
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.ATLAS_URI; // get the uri from .env file

let _db; // declare a variable to store the database connection

module.exports = {
    connectToServer: function( callback ) {
        console.log("Attempting to connect to MongoDB")
        // Create a MongoClient with a MongoClientOptions object to set the Stable API version
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
        });

        async function run() {
            try {
                // Connect the client to the server	(optional starting in v4.7)
                await client.connect();
                // Send a ping to confirm a successful connection
                await client.db("admin").command({ ping: 1 });
                console.log("Pinged your deployment. You successfully connected to MongoDB!");
                _db = client.db("Hangman"); // specify the database to use
                console.log("Connected to the employees database");

            } finally {
                // Ensures that the client will close when you finish/error
                //console.log("Closing the client connection");
                //await client.close();
            }
        }
        run().catch(console.dir);
    },

    getDb: function() {
        return _db;
    }

};

