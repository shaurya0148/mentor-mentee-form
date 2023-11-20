const { MongoClient, ServerApiVersion } = require('mongodb');

// Replace this with your actual MongoDB connection string
const uri = "mongodb+srv://dbuser:<baller32>@cluster0.loqftmh.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToMongoDB() {
  try {
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error(err);
  }
}

module.exports = { connectToMongoDB, client };
