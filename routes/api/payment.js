const router = require('express').Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Event = mongoose.model('Event');
const auth = require('../auth');

const genericErrorMessage = "There was a problem processing your credit card; please double check your payment information and try again. If the problem persists contact our support or your bank.";

const PaymentService = require("./../../services/payment/payment");

const paymentService = new PaymentService(
  process.env.BRAINTREE_MERCHANT_ID,
  process.env.BRAINTREE_PUBLIC_KEY,
  process.env.BRAINTREE_PRIVATE_KEY,
  process.env.BRAINTREE_IS_SANDBOX
);

router.post('/client_token', auth.required, async (req, res) => {
  const payload = await paymentService.generateClientToken(); // TODO: Add option for remembering the payment method
  res.send({ clientToken: payload.clientToken });
});


// // TODO: How to preload stuff? 

// Reference for processor response codes https://developers.braintreepayments.com/reference/general/processor-responses/authorization-responses
// Used for finishing the process of credit-card payment. 
// Recevies the payment method nonce, generated from users credit card information on braintree servers and returned to our front end.
// Our front-end makes this call.  
router.post("/checkout", auth.required, async (req, res, next) => {
  // TODO: Middleware for checking checkout request body 

  const paymentNonce = req.body.payload.nonce;

  // In sandbox mode, weather or not the transaction succeeds depends on the payment nonce and the amount sent.
  // Any amount above 2000 will result in the error code, corresponding to the whole number value.
  // There is like a 1000 possible error codes. That's a lot. 

  // TODO: Get this in the middleware. Populate the author! 
  const event = await Event.findOne({ slug: req.body.event.slug });
  const amount = event.price;

  const transaction = await paymentService.createSaleTransaction(paymentNonce, amount);

  // Refer to this for transaction status values: https://developers.braintreepayments.com/reference/general/statuses
  if (!transaction.success)
    return res.status(400).send({ message: genericErrorMessage });
  
  // TODO: Move this into a separate server. Make them communicate using RabbitMQ or Kafka.
  try {
    const user = await User.findById(req.payload.id);
    if (!user) 
      return res.sendStatus(401);

    await user.subscribe(event._id);
    await event.updateSubscribersCount();

    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;