const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: String,
    barcode:Number,
    isActive:Boolean,
    price:Number,
    stock:Number,
    lowStock:Number,
    createdAt: Date,
    updatedAt: Date,
});

const createProductModel = (collectionName) => {
    collectionName=collectionName+"_products"
    const Product = mongoose.model('Product', productSchema, collectionName);
    return Product;
  };

module.exports=createProductModel;
