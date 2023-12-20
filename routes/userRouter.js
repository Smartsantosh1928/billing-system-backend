const express = require("express");
const router = express.Router();
const User = require('../models/userModel');

router.get('/allusers',(req,res)=>{
    User.find().then(users=>{
        if(users==null)
            return res.json({status:false,msg:"No users in the database"})
        else
        {
            const record = users.map(user => ({ name: user.name, email: user.email, role: user.role, createdAt: user.createdAt }));
            res.json({User:record,status:true,msg:"Users data successfully sended"})
        }
    })
})
 


module.exports=router;