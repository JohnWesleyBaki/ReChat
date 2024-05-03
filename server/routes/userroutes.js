const express = require("express")

const router = express.Router()

const UserModel = require("../models/User")

// const userController = require("../controllers/userController")



router.post('/register',async(req,res) =>{
    try{
        const{name,email,password} = req.body

        const user = new UserModel({
            name,
            email,
            password
        })

         await user.save()
        res.status(201).json(user)
    } catch(error){
        console.log("Error:",error)
        res.status(500).json({message:"Server Error"})
    }
})

module.exports = router