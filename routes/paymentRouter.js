const express = require("express");
const stripe = require("stripe")(process.env.Stripe_SERECT);
const router = express.Router();


router.post('/create-checkout-session',async(req,res)=>{
    const {details} = req.body;
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'inr', 
              product_data: {
                name: 'Your Subscription Plan',
              },
              unit_amount: Math.round(details.price*100),  
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',
      });
    res.json({id:session.id})
})  




module.exports=router;