const stripe = require('stripe')(process.env.JWT_SECRET);

module.exports = stripe;
