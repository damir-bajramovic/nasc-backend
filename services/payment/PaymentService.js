const braintree = require('braintree');

/**
 * Represents a class that is used to encapsulate server-side of interaction with the braintree servers. 
 * Provides functionality of credit-card payments.
 * @class PaymentService
 */
class PaymentService { 
  
  /**
   * Throws if it is impossible to establish a connection to the Braintree gateway. 
   * @constructor 
   * @param {string} merchantId 
   * @param {string} publicKey 
   * @param {string} privateKey 
   * @param {boolean} isSandbox 
   */
  constructor(merchantId, publicKey, privateKey, isSandbox) {
    const environment = isSandbox ? braintree.Environment.Sandbox : braintree.Environment.Production;
    this._gateway = braintree.connect({
      environment,
      merchantId,
      publicKey,
      privateKey
    });
  }
  
  /**
   * Throws if it is impossible to generate a token, or the customer/merchant doesn't exist. 
   * @param {string} [customerId=null] Argument used only with the Drop-in UI. Customers can manage their vaulted payment methods via Drop-in UI.
   * @returns a client token, used to initialize hosted fields instance, or a Drop-in UI on the front-end side.
   * @memberof PaymentService
   */
  async generateClientToken(customerId = null) {
    return await this._gateway.clientToken.generate( { customerId } );
  }

  /**
   * Create a sale transaction. Throws if it is impossible to create a transaction in this moment. 
   * @param {string} paymentMethodNonce Payment method nonce, passed from the front end. Front end gets the payment method nonce from the braintree servers.
   * @param {string} amount String representing a floating point number. 2 decimals.
   * @returns a transaction object 
   * @memberof PaymentService
   */
  async createSaleTransaction(paymentMethodNonce, amount) { 
    return await this._gateway.transaction.sale({
      amount, 
      paymentMethodNonce,
      options: {
        submitForSettlement: true 
      }
    });
  }
 
  /**
   * Creates a braintree customer. Check result for success value. Value can be false if one of the arguments is not valid. 
   * @param {string} id 
   * @param {string} firstName
   * @param {string} lastName
   * @param {string} email
   * @returns Returns a result object. Result objects contains the customer. Check result for success value. Value can be false if one of the arguments is not valid.
   * @memberof PaymentService
   */
  async createCustomer(id, firstName, lastName, email) { 
    return await this._gateway.customer.create({
      id,
      firstName,
      lastName,
      email
    });
  }
 
  /**
   * Deletes a customer. Throws if the customer with the specified Id doesn't exist.
   * @param {string} customerId
   * @returns Empty object if the result was successful.
   * @memberof PaymentService
   */
  async deleteCustomer(customerId) {
    return await this._gateway.customer.delete(customerId);
  }

  /**
   * Find customer. 
   * @param {string} customerId
   * @returns Returns result object, containing the customer with the specified Id. Throws if the customer with the specified Id doesn't exist.
   * @memberof PaymentService
   */
  async findCustomer(customerId) {
    return await this._gateway.customer.find(customerId);
  }

  /**
   * First payment method created becomes the default payment method for the customer. 
   * Used for Drop-in UI.
   * Refer to this for details about braintree payment methods: https://developers.braintreepayments.com/guides/payment-methods/node 
   * @param {string} customerId
   * @param {string} paymentMethodNonce
   * @param {boolean} [makeDefault = false] Make this payment method the default payment method for this customer.  
   * @memberof PaymentService
   */
  async createPaymentMethodForCustomer(customerId, paymentMethodNonce, makeDefault = false) { 
      return await this._gateway.paymentMethod.create({
      customerId,
      paymentMethodNonce,
      makeDefault
    });
  }

  /**
   * Update the specified payment method. 
   * @param {string} paymentMethodNonce Token value that is kept in the braintree database. 
   * @param {object} options Refer to this for options: https://developers.braintreepayments.com/reference/request/payment-method/update/node
   * @memberof PaymentService
   */
  async updatePaymentMethod(paymentMethodNonce, options) {
    return await this._gateway.paymentMethod.update(paymentMethodNonce, options);
  }

  /**
   * If required, this method can return values which are valid back to the user and re-fill the form. ++UX
   * It would be nice to log the codes somewhere. 
   * Messages can be used on the client-side, to show the user what went wrong with entered information.
   * Refer to this for more information about validation errors: https://developers.braintreepayments.com/reference/general/validation-errors/overview/node
   * @param {object} errors Errors object, it is taken off of the result object. Result object represents an unsuccessful request of braintree services. 
   * @returns result object which contains two arrays: codes and messages. Codes should be logged somewhere, and messages are human-readable. 
   * You shouldn't pass all of the messages to the front-end, as they are quite descriptive, to help mitigate fraud. 
   * @memberof PaymentService
   */
  handleValidationErrors(errors) {
    const deepErrors = errors.deepErrors();
    let result = {
        codes: [],
        messages: []
    };
    // TODO: Handle deepError.ownProperty.attribute if necessary. 
    for (let i in deepErrors) {
        if (deepErrors.hasOwnProperty(i)) {
            result.codes.push(deepErrors[i].code);
            result.messages.push(deepErrors[i].message);
        }
    }
    return result;
  }  
}

module.exports = PaymentService;