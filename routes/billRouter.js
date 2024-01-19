const express = require("express");
const router = express.Router();
const {verifyToken,verifyUser} = require('../utils');
const createBillModel = require('../models/productModel');
const User = require('../models/userModel');

const addUserDatabaseToBillModel = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
      return { success: false, msg: 'User not found' };
    }
    if(user.role!="admin")
    {
        const adminuser=await User.findOne({storename:user.storename ,role:"admin"});
        const Bill = createBillModel(adminuser.collectionName);
        return Bill;
    }

    const cname = user.collectionName;
    const Bill = createBillModel(cname);
    return Bill;
  };

router.get('/new-bill',verifyToken,async(req,res)=>{
    const user = req.user;
    verifyUser(user);
    const {customerName,items,totalAmount}=req.body;
    const createdAt=new Date();
    const updatedAt=new Date();   
    const Bill=await addUserDatabaseToBillModel(user.email); 
    const bill=new Bill({customerName,items,totalAmount,createdAt,updatedAt});
    try{
        Bill.create(bill).then((b)=>{
            res.json({ success: true, msg: "Bill Created Successfully!"});
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
      }
})


module.exports=router;