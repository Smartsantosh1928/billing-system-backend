const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const { generateOTP, verifyToken } = require('../utils');
const sendMail = require('../config/mailer');

router.post('/register',(req,res) => {
    const { name,email,password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    User.findOne({ email }).then(user => {
        if(user) return res.json({ success: false, msg: "User already exists!" });
        else{
            const role='cashier',isActive=false,otp=generateOTP();
            const accessToken = jwt.sign({name,email,role,isActive},process.env.ACCESS_TOKEN_SECRET,
                {
                expiresIn: '1h', 
                issuer: 'http://localhost:3000', 
                }
            );
            const refreshToken = jwt.sign({name,email,role,isActive},process.env.REFRESH_TOKEN_SECRET);
            const user = { 
                name,email,password: hashedPassword,
                isActive: false,role: 'cashier',
                refreshToken,createdAt: new Date(),
                updatedAt: new Date(),otp
            };
            User.create(user).then(user => {
                sendMail(user.email,'OTP for Cashier Registration',`Your OTP is ${otp}`)
                .then(() => {
                    res.json({ success: true, msg: "User Registered Successfully!",accessToken,refreshToken });
                })
                .catch(err => {
                    res.json({ success: false, msg: err.message });
                })
            })
        }
    })
})

router.post('/verifyOTP',verifyToken,(req,res) => {
    const { otp } = req.body;
    const { email } = req.user;
    User.findOne({ email }).then(user => {
        if(!user) return res.json({ success: false, msg: "User not found!" });
        else{
            if(user.otp == otp){
                user.isActive = true;
                user.save().then(() => {
                    res.json({ success: true, msg: "OTP Verified Successfully!" });
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
                    res.json({ success: true, msg: "User Logged In Successfully!",accessToken,refreshToken });
                })
            }
            else return res.json({ success: false, msg: "Invalid Password!" });
        }
    })
})

router.post('/getRefreshToken',(req,res) => {
    const { refreshToken } = req.body;
    if(refreshToken == null) return res.sendStatus(401);
    User.findOne({ refreshToken }).then(user => {
        if(!user) return res.sendStatus(403);
        else{
            const { name,email,role,isActive } = user;
            const accessToken = jwt.sign({ name,email,role,isActive }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3600s' });
            res.json({ accessToken });
        }
    })
})

module.exports = router