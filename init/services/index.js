const PaymentService = require('./../../services/payment/payment');

const paymentService = new PaymentService(
  process.env.BRAINTREE_MERCHANT_ID,
  process.env.BRAINTREE_PUBLIC_KEY,
  process.env.BRAINTREE_PRIVATE_KEY,
  process.env.BRAINTREE_IS_SANDBOX
);

module.exports = {
    paymentService
};