const express = require("express");
const router = express.Router();
const {verifyToken,verifyUser} = require('../utils');
const createProductModel = require('../models/productModel');
const createBillModel = require('../models/billModel');
const Sequence = require('../models/sequenceModel');
const User = require('../models/userModel');


async function getNextSequenceValue(sequenceName) {
  const sequence = await Sequence.findOneAndUpdate(
    { name: sequenceName },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );
  return sequence.value;
}

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

const getproductmodel= async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    return { success: false, msg: 'User not found' };
  }
  if(user.role!="admin")
  {
      const adminuser=await User.findOne({storename:user.storename ,role:"admin"});
      const Product = createProductModel(adminuser.collectionName);
      return Product;
  }

  const cname = user.collectionName;
  const Product = createProductModel(cname);
  return Product;
};

 
router.post('/new-bill',verifyToken,async(req,res)=>{
  const {user} = req
  console.log(req);
  verifyUser(user)
  try{
    let name = "";
    const user = req.user;
    verifyUser(user);
    const {email} = user
    if(user.role != "admin")
    {
      const cashier = await User.findOne({ email });
      const admin=await User.findOne({storename:cashier.storename ,role:"admin"});
      name = admin.name;
    }
    else{
      name  = user.name;
    }
    const seq=new Sequence({
      name
    });
      Sequence.findOne({name}).then(data=>{
        if(!data)
          Sequence.create(seq).then((data)=>{
            console.log("sequence created")
        }); 
      })
    
    const billno = await getNextSequenceValue(name);
    const {customerName,city,number,items,totalAmount}=req.body;
    const createdAt=new Date();
    const updatedAt=new Date();   
    const Product=await getproductmodel(user.email);
    const Bill=await addUserDatabaseToBillModel(user.email); 
    const bill=new Bill({billno,customerName,city,number,items,totalAmount,createdAt,updatedAt});
    for (const item of items) {
      const { productName, quantity } = item;
      const product = await Product.findOne({ name: productName });
      if (product) {
        product.stock -= quantity;
        await product.save();
      } else {
        console.warn(`Product not found: ${productName}`);
      }
    }
        Bill.create(bill).then((b)=>{
            res.json({ success: true, msg: "Bill Created Successfully!"});
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
      }
})

router.post("/allbills",verifyToken,async(req,res)=>{
    const user = req.user;
    verifyUser(user)
    const perpage = parseInt(req.body.perpage)||10;
    const page = parseInt(req.body.page)||1;
    const skip = (page-1)*perpage;
    const Bill=await addUserDatabaseToBillModel(user.email); 
    Bill.find().sort({name:1}).skip(skip).limit(perpage).then(bill=>{
        if(bill==null)
            return res.json({success: false , msg: "No products in the database"});
        else{
            Bill.countDocuments().then(t=>{
                res.json({Bills:bill,totalPages:Math.ceil(t / perpage),currentPage:page,totalItems:t})
            })
        }
    })
})


module.exports=router;