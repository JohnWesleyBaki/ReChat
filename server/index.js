const express = require("express");
const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");
const cors = require('cors');

const bodyParser = require('body-parser');

const userRoutes = require("./routes/userroutes")

const app = express();

app.use(express.json())

app.use(cors());

dotenv.config({ path: './config.env' });
app.use(bodyParser.json());

const PORT = process.env.PORT || 5050;







const mongoURI = process.env.MONGO_URI || "";

MongoClient.connect(mongoURI, 
  { 
socketTimeoutMS: 5000})
  .then((client) => {
    console.log("MongoDB connected successfully");
    
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  });

app.use("/users",userRoutes)


// app.post("/register", (req,res) =>{

//   console.log("Request Body:", req.body);
//   UserModel.create(req.body)
//   .then(users => {
//     console.log('User created successfully:', users);
//     res.status(201).json(users);
//   })
//   .catch(err => {
//     console.error('Error creating user:', err);
//     res.status(500).json({ message: 'Error creating user' });
//   });




// })




app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
