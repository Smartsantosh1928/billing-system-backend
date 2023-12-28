const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongodb=require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const { generateOTP, verifyToken } = require('../utils');
const sendMail = require('../config/mailer');

router.post('/register',(req,res) => {
    const { name,email,password,role} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    User.findOne({ email }).then(user => {
        if(user) return res.json({ success: false, msg: "User already exists!" });
        else{
            const isActive=false,otp=generateOTP();
            const user = { 
                name,email,password: hashedPassword,
                isActive: false,role,
                refreshToken:"",createdAt: new Date(),
                updatedAt: new Date(),otp
            };
            User.create(user).then(user => {
                sendMail(user.email,'OTP for Cashier Registration',`Your OTP is ${otp}`)
                .then(() => {
                    if(role==='admin')
                        mongodb.createConnection(`mongodb://127.0.0.1:27017/${name}`, { useNewUrlParser: true, useUnifiedTopology: true });
                }).then(()=>{
                    res.json({ success: true, msg: "User Registered Successfully!"});
                })
                .catch(err => {
                    res.json({ success: false, msg: err.message });
                })
            })
        }
    })
})

router.post('/verifyOTP',(req,res) => {
    const { otp, email } = req.body;
    User.findOne({ email }).then(user => {
        if(!user) return res.json({ success: false, msg: "User not found!" });
        else{
            if(user.otp == otp){
                user.isActive = true;
                const { name,email,role,isActive } = user;
                const accessToken = jwt.sign({name,email,role,isActive},process.env.ACCESS_TOKEN_SECRET,
                    {
                    expiresIn: '1h', 
                    issuer: 'http://localhost:3000', 
                    }
                );
                const refreshToken = jwt.sign({name,email,role,isActive},process.env.REFRESH_TOKEN_SECRET);
                user.refreshToken = refreshToken;
                user.save().then(() => {
                    res.json({ success: true, msg: "OTP Verified Successfully!" ,accessToken,refreshToken});
                })
            }
            else return res.json({ success: false, msg: "Invalid OTP!" });
        }
    })
})

router.post('/login',(req,res) => {
    const { email,password } = req.body;
    User.findOne({ email }).then(user => {
        if(!user) return res.json({ success: false, msg: "User not found!" });
        else if(!user.isActive) return res.json({ success: false, msg: "User not verified!" });
        else{
            if(bcrypt.compareSync(password, user.password)){
                const { name,email,role,isActive } = user;
                const accessToken = jwt.sign({ name,email,role,isActive }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3600s' });
                const refreshToken = jwt.sign({ name,email,role,isActive }, process.env.REFRESH_TOKEN_SECRET);
                user.refreshToken = refreshToken;
                user.save().then(() => {
                    res.json({ success: true, msg: "User Logged In Successfully!",accessToken,refreshToken,role});
                })
            }
            else return res.json({ success: false, msg: "Invalid Password!" });
        }
    })
})

router.post('/verifyUser',verifyToken,(req,res) => {
    const user = req.user;
    if(!user) return res.json({ success: false, msg: "User not found!" });
    else if(!user.isActive) return res.json({ success: false, msg: "User not verified!" });
    else return res.json({ success: true, msg: "User Verified Successfully!",role: user.role});
})

router.post('/getAccessToken',(req,res) => {
    const { refreshToken } = req.body;
    if(refreshToken == null) return res.sendStatus(401);
    User.findOne({ refreshToken }).then(user => {
        if(!user) return res.sendStatus(403);
        else{
            const { name,email,role,isActive } = user;
            const accessToken = jwt.sign({ name,email,role,isActive }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3600s' });
            res.json({ success: true, accessToken });
        }
    })
})

module.exports = router