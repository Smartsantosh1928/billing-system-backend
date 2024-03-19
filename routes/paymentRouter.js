// import Stripe from 'stripe'
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
// const Stripe = require("stripe")
const router = express.Router();

router.post('/create-checkout-session',async(req,res)=>{
    const {price} = req.body; 

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'inr', 
              product_data: {
                name: 'Your Subscription Plan',
              },
              unit_amount: Math.round(price*100),  
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: 'http://localhost:5173/auth/signup',
        cancel_url: 'http://localhost:3000/cancel',
      });
    res.json({paymentLink:session.url,id:session.id})
})  




module.exports=router;