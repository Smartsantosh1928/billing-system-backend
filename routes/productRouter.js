const express = require("express");
const router = express.Router();
const Product = require('../models/productModel');

router.post('/add',(req,res)=>{
    const {name,barcode,measurement,isActive,image,description,color,price,stock,lowStock}=req.body;
    console.log(req.body);
    const createdAt=new Date();
    const updatedAt=new Date();
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


router.post('/stockupdate',(req,res)=>{
    const {id,newstock}=req.body;
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

router.post('/update',(req,res)=>{
    const {id,name,barcode,measurement,isActive,description,image,color,price,stock,lowStock}=req.body;
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

router.post('/delete/:_id',(req,res)=>{
    const id = req.params._id;
    Product.findOne({id}).then(product=>{
        if(product==null)
            return res.json({success: false , msg: "Product was not in the database"});
        else{
           Product.findByIdAndDelete(product._id).then(pro=>{
                res.json({success: true , msg: "Product Deleted"});
           })
        }
    })

})


router.post('/',(req,res)=>{
    const perpage = parseInt(req.body.perpage)||10;
    const page = parseInt(req.body.page)||1;
    const skip = (page-1)*perpage;
    Product.find().sort({name:1}).skip(skip).limit(perpage).then(pro=>{
        if(pro==null)
            return res.json({success: false , msg: "No products in the database"});
        else{
            Product.countDocuments().then(totalItems=>{
                res.json({Products:pro,totalPages:Math.ceil(totalItems / perpage),currentPage:page})
            })
        }
    })
})
router.post('/lowstack',(req,res)=>{
    const perpage = parseInt(req.body.perpage)||10;
    const page = parseInt(req.body.page)||1;
    const skip = (page-1)*perpage;
    Product.find({ $expr: {$lt: ["$stock", "$lowStock"]} }).sort({name:1}).skip(skip).limit(perpage).then(pro=>{
        if(pro==null)
            return res.json({success: false , msg: "No lowstack products in the database"});
        else{
            res.json({Products:pro,totalPages:Math.ceil(pro.length / perpage),currentPage:page})
        }
            
    })
})

module.exports=router;