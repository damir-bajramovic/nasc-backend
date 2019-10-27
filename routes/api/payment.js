const router = require('express').Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const auth = require('../auth');

const genericErrorMessage = "There was a problem processing your credit card; please double check your payment information and try again. If the problem persists contact our support or your bank.";

const PaymentService = require("./../../services/payment/payment");

const paymentService = new PaymentService(
  process.env.BRAINTREE_MERCHANT_ID,
  process.env.BRAINTREE_PUBLIC_KEY,
  process.env.BRAINTREE_PRIVATE_KEY,
  process.env.BRAINTREE_IS_SANDBOX
);

// Method used to generate and return a client token. Client token is used for creating hosted fields instances or Drop-In UI instances on the front-end side for credit-card payment. 
router.post('/client_token', async (req, res) => {
  const customerId = req.body.customerId ? req.body.customerId : null;
  
  const payload = await paymentService.generateClientToken(customerId);

  res.send({ clientToken: payload.clientToken });
});

// Reference for processor response codes https://developers.braintreepayments.com/reference/general/processor-responses/authorization-responses
// Used for finishing the process of credit-card payment. 
// Recevies the payment method nonce, generated from users credit card information on braintree servers and returned to our front end.
// Our front-end makes this call.  
router.post("/checkout", async (req, res) => {
  // TODO: Middleware for checking checkout request body 

  const paymentNonce = req.body.payload.nonce;
  
  // In sandbox mode, weather or not the transaction succeeds depends on the payment nonce and the amount sent.
  // Any amount above 2000 will result in the error code, corresponding to the whole number value.
  // There is like a 1000 possible error codes. That's a lot. 
  // TODO: Determine amount 
  const amount = "15.00"; 

  const transaction = await paymentService.createSaleTransaction(paymentNonce, amount);

  // Refer to this for transaction status values: https://developers.braintreepayments.com/reference/general/statuses
  if (!transaction.success)
    res.status(400).send({ message: genericErrorMessage });
  
  // TODO: Change the subscription status of that user. 
  // TODO: Move this into a separate server. Make them communicate using RabbitMQ.
});

module.exports = router;