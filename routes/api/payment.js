const router = require('express').Router();
const auth = require('../auth');

const genericErrorMessage = "There was a problem processing your credit card; please double check your payment information and try again. If the problem persists contact our support or your bank.";

const { paymentService } = require('./../../init/services/index');


// TODO: Change this endpoint name
router.post('/client_token', auth.required, async (req, res) => {
  // TODO: Add error handling
  const payload = await paymentService.generateClientToken(); // TODO: Add option for remembering the payment method
  res.send({ clientToken: payload.clientToken });
});

module.exports = router;