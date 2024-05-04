const express = require("express")

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


const db = require("../db/connection.js")


const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const usersCollection = db.collection('users');
    const result = await usersCollection.insertOne({ name, email, password });

    if (result.insertedId) {
        const insertedDocument = await usersCollection.findOne({ _id: result.insertedId });
        res.status(201).json(insertedDocument);
      } else {
        res.status(500).json({ message: 'Error creating user' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: error.message });
    }
});

module.exports = router