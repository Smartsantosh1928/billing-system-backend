const express = require("express");
const router = express.Router();
const {verifyToken,verifyUser} = require('../utils');
const User = require('../models/userModel');

router.get('/allusers',verifyToken,(req,res)=>{
    const user = req.user
    verifyUser(user);
    User.find().then(users=>{
        if(users==null)
            return res.json({status:false,msg:"No users in the database"})
        else
        {
            const record = users.map(user => ({ name: user.name, email: user.email, role: user.role, storename: user.storename, createdAt: user.createdAt }));
            res.json({User:record,status:true,msg:"Users data successfully sended"})
        }
    })
})
 
router.delete('/allusers/:email',(req,res)=>{
    const email=req.params.email
    User.findOne({email}).then(user=>{
        if(user==null)
            return res.json({status:false,msg:"No user in the database"})
        else
            User.findOneAndDelete({email}).then(user=>{
                res.json({success: true , msg: "User Deleted"});
        })
    })
})

module.exports=router;