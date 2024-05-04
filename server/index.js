const express = require("express");
const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");
const cors = require('cors');

const bodyParser = require('body-parser');





const userRoutes = require("./routes/userroutes")







// const mongoURI = process.env.MONGO_URI || "";

// MongoClient.connect(mongoURI)
//   .then((client) => {
//     console.log("MongoDB connected successfully");
    
//   })
//   .catch((error) => {
//     console.error("Error connecting to MongoDB:", error);
//     process.exit(1);
//   });
// app.use("/users",userRoutes)


// // app.post("/register", (req,res) =>{

// //   console.log("Request Body:", req.body);
// //   UserModel.create(req.body)
// //   .then(users => {
// //     console.log('User created successfully:', users);
// //     res.status(201).json(users);
// //   })
// //   .catch(err => {
// //     console.error('Error creating user:', err);
// //     res.status(500).json({ message: 'Error creating user' });
// //   });




// // })






dotenv.config({ path: './config.env' });

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());



app.use('/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});