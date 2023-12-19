const express = require("express");
const router = express.Router();
const User = require('../models/userModel');

router.post('/allusers',(req,res)=>{
    User.find().then(users=>{
        if(users==null)
            return res.json({status:false,msg:"No users in the database"})
        else
            res.json({User:users,status:true,msg:"Users data sended"})
    })
})



module.exports=router;