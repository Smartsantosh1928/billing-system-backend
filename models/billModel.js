const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const billSchema = new Schema({
    customerName: {
        type: String,
        required: true,
      },
      items: [
        {
          productName: {
            type: String,
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
          unitPrice: {
            type: Number,
            required: true,
          },
        },
      ],
      totalAmount: {
        type: Number,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
      },
});

const createBillModel = (collectionName) => {
    collectionName=collectionName+"_bills"
    const Bill = mongoose.model('bill', billSchema, collectionName);
    return Bill;
  };

module.exports=createProductModel;