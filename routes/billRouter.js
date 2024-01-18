const express = require("express");
const router = express.Router();
const Product = require('../models/productModel');

router.get('/new-bill',(req,res)=>{
    Product.find().then(pro=>{
        if(pro==null)
            return res.json({success: false , msg: "No products in the database"});
        else{
                res.json({success: true,Products:pro});
        }
    })
})


module.exports=router;