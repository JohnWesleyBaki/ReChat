// const express = require("express")

// const router = express.Router()

// const UserModel = require("../models/User")

// // const userController = require("../controllers/userController")



// router.post('/register',async(req,res) =>{
//     try{
//         console.log(req.body)
//         const{name,email,password} = req.body

//         const user = new UserModel({
//             name,
//             email,
//             password
//         })

//          await user.save()
//         res.status(201).json(user)
//     } catch(error){
//         console.log("Error:",error)
//         res.status(500).json({message:error.message})
//     }
// })

// module.exports = router

const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db/connection.js");
const { ObjectId } = require('mongodb');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const usersCollection = db.collection('users');
    const users = await usersCollection.find({}).toArray();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("Recieved registration",req.body)


    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const usersCollection = db.collection('users');
    const result = await usersCollection.insertOne({ name, email, password: hashedPassword });

    if (result.insertedId) {
      const insertedDocument = await usersCollection.findOne({ _id: result.insertedId });
      // Remove password from the response
      const { password, ...userWithoutPassword } = insertedDocument;
      res.status(201).json(userWithoutPassword);
    } else {
      res.status(500).json({ message: 'Error creating user' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// router.post("/login", async (req, res) => {
//   try {
//     console.log("Received login request:", req.body);
//     const { email, password } = req.body;

//     if (!email || !password) {
//       console.log("Missing email or password");
//       return res.status(400).json({ message: "Email and password are required" });
//     }

//     const usersCollection = db.collection("users");
//     const user = await usersCollection.findOne({ email });

//     console.log("User found:", user ? "Yes" : "No");

//     if (!user) {
//       return res.status(401).json({ message: "User not found" });
//     }

//     const passwordMatch = await bcrypt.compare(password, user.password);
//     console.log("Password match:", passwordMatch);

//     if (!passwordMatch) {
//       return res.status(401).json({ message: "Incorrect password" });
//     }

//     const { password: _, ...userWithoutPassword } = user;
//     res.status(200).json({ message: "Login successful", user: userWithoutPassword });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ message: error.message });
//   }
// });

const jwt = require("jsonwebtoken");

// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const usersCollection = db.collection("users");
//     const user = await usersCollection.findOne({ email });

//     if (!user) {
//       return res.status(401).json({ message: "User not found" });
//     }

//     const passwordMatch = await bcrypt.compare(password, user.password);

//     if (!passwordMatch) {
//       return res.status(401).json({ message: "Incorrect password" });
//     }

//     const token = jwt.sign(
//       { id: user._id, name: user.name, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.status(200).json({
//       message: "Login successful",
//       token,
//       user: { name: user.name, email: user.email },
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ message: error.message });
//   }
// });


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Received login request:", req.body);
    console.log('Login attempt with email:', email);

    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({ email });
    // console.log('User found:', user);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', passwordMatch);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
});


// router.post('/start-chat', async (req, res) => {
//   const { userId1, userId2 } = req.body;

//   try {
//     const chatsCollection = db.collection('chats');

//     // Check if a chat session already exists
//     let chat = await chatsCollection.findOne({
//       participants: { $all: [new ObjectId(userId1), new ObjectId(userId2)] }
//     });

//     if (!chat) {
//       // Create a new chat session
//       chat = await chatsCollection.insertOne({
//         participants: [new ObjectId(userId1), new ObjectId(userId2)],
//         messages: []
//       });
//     }

//     res.status(200).json(chat);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });


module.exports = router;