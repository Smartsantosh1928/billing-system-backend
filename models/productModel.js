const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: String,
    barcode:Number,
    measurement:String,
    isActive:Boolean,
    description:String,
    image:String,
    color:String,
    price:Number,
    stock:Number,
    lowStock:Number,
    createdAt: Date,
    updatedAt: Date,
});

// const Product=db.model('Product', productSchema);

module.exports=productSchema;