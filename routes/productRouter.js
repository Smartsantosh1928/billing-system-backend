const express = require("express");
const router = express.Router();
const User = require('../models/userModel');
const createProductModel = require('../models/productModel');
const {verifyToken} = require('../utils');
const {verifyUser} = require("../routes/authRouter");

const addUserDatabaseToProductModel = async (email) => {
    const user = await User.findOne({ email });
  
    if (!user) {
      return { success: false, msg: 'User not found' };
    }
  
    const cname = user.collectionName;
    const Product = createProductModel(cname);
  
    return Product;
  };

router.post('/add',verifyToken,async(req,res)=>{
    const user = req.user;
    verifyUser(user)
    const {name,barcode,measurement,isActive,image,description,color,price,stock,lowStock}=req.body;
    console.log(req.body);
    const createdAt=new Date();
    const updatedAt=new Date();
    const Product = await addUserDatabaseToProductModel(email);
            const product=new Product({
                name,barcode,measurement,isActive,description,image,color,price,stock,lowStock,createdAt,updatedAt
            });
            Product.findOne({name}).then(pro=>{
                if(pro)
                    return res.json({success:false,msg:"Product already exists!"});
                else{
                    Product.create(product).then((product)=>{
                        res.json({ success: true, msg: "Product Added Successfully!"});
                    });
                }
            })
    })


router.post('/stockupdate',verifyToken,async(req,res)=>{
    const user = req.user;
    verifyUser(user)
    const {id,newstock}=req.body;
    const Product = await addUserDatabaseToProductModel(email);
    Product.findOne({id}).then(product=>{
        if(product==null)
            return res.json({success:false,msg:"Product was not in the database"});
        else{
            const stock=product.stock+newstock
            const Updatevalue={
             stock,
             updatedAt:new Date()
            }
            Product.findByIdAndUpdate(product._id,{$set:Updatevalue},{new : true}).then((product)=>{
                res.json({success:true , msg:"Updated successfully"});
            });
        }
    })

})

router.post('/update',verifyToken,async(req,res)=>{
    const user = req.user;
    verifyUser(user)
    const {id,name,barcode,measurement,isActive,description,image,color,price,stock,lowStock}=req.body;
    const Product = await addUserDatabaseToProductModel(email);
    Product.findOne({id}).then(pro=>{
        if(pro==null)
            return res.json({success:false,msg:"Product was not in the database"});
        else{
            pro.name=name;
            pro.barcode=barcode;
            pro.measurement=measurement;
            pro.isActive=isActive;
            pro.description=description;
            pro.image=image;
            pro.color=color;
            pro.price=price;
            pro.stock=stock;
            pro.lowStock=lowStock;
            pro.updatedAt=new Date();
            pro.save().then(() => {
                res.json({ success: true, msg: "Product updated successfully!" });
            })
        }
    })
})

// router.delete('/delete/:_id',(req,res)=>{
//     const id = req.params._id;
//     const pro = Product.findById(id).then(product=>{
//         console.log(product)
//         if(product==null)
//             return res.json({success: false , msg: "Product was not in the database"});
//         else{
//            Product.findByIdAndDelete(product._id).then(pro=>{
//                 res.json({success: true , msg: "Product Deleted"});
//            })
//         }
//     })
// })


router.delete('/delete/:_id',verifyToken, async(req, res) => {
    const user = req.user;
    verifyUser(user)
    const id = req.params._id;
    const Product = await addUserDatabaseToProductModel(email);
    Product.findById(id)
        .then(product => {
            if (product === null) {
                return res.json({ success: false, msg: "Product was not found in the database" });
            } else {
                Product.findByIdAndDelete(id)
                    .then(() => {
                        res.json({ success: true, msg: "Product Deleted" });
                    })
                    .catch(err => {
                        res.status(500).json({ success: false, msg: "Error deleting product", error: err });
                    });
            }
        })
        .catch(err => {
            res.status(500).json({ success: false, msg: "Error finding product", error: err });
        });
});



router.post('/',verifyToken,async(req,res)=>{
    const user = req.user;
    verifyUser(user)
    const perpage = parseInt(req.body.perpage)||10;
    const page = parseInt(req.body.page)||1;
    const skip = (page-1)*perpage;
    const Product = await addUserDatabaseToProductModel(email);
    Product.find().sort({name:1}).skip(skip).limit(perpage).then(pro=>{
        if(pro==null)
            return res.json({success: false , msg: "No products in the database"});
        else{
            Product.countDocuments().then(t=>{
                res.json({Products:pro,totalPages:Math.ceil(t / perpage),currentPage:page,totalItems:t})
            })
        }
    })
})
router.post('/lowstack',verifyToken,async(req,res)=>{
    const user = req.user;
    verifyUser(user)
    const perpage = parseInt(req.body.perpage)||10;
    const page = parseInt(req.body.page)||1;
    const skip = (page-1)*perpage;
    const Product = await addUserDatabaseToProductModel(email);
    Product.find({ $expr: {$lt: ["$stock", "$lowStock"]} }).sort({name:1}).skip(skip).limit(perpage).then(pro=>{
        if(pro==null)
            return res.json({success: false , msg: "No lowstack products in the database"});
        else{
            Product.countDocuments().then(t=>{
                res.json({Products:pro,totalPages:Math.ceil(t / perpage),currentPage:page,totalItems:pro.length})
            })
        }
            
    })
})

router.post('/totalusers',verifyToken,(req,res)=>{
    const user = req.user;
    verifyUser(user)
    User.find().then(user=>{
        if(user===null)
            return res.status(500).json({success:false,msg:"NO users in the database"})
        else{
            User.countDocuments().then(t=>{
                res.json({success:true,totaluser:t})
            })
        }
    })
})

module.exports=router;