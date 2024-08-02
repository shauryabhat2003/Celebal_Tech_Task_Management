const express = require('express');
const router = express.Router();
const stripe = require('../config/stripe');

// Create a new payment intent
router.post('/create-payment-intent', async (req, res) => {
    const { amount, currency } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
