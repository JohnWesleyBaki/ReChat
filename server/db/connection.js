
const { MongoClient, ServerApiVersion } = require("mongodb");
const dotenv = require("dotenv");


dotenv.config({ path: './config.env' });

const URI = process.env.MONGO_URI || "";


const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


async function connectToDatabase() {
  try {
    
    await client.connect();

    
    await client.db("admin").command({ ping: 1 });

   
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    
    console.error(err);
   
  }
}


connectToDatabase();


const db = client.db("users");
module.exports = db;
