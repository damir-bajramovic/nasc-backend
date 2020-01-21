const SendGrid = require('sendgrid');

const Helpers = require('./helpers');

/**
 * Sendgrid mailing service.
 */
class MailingService {

    /**
     * Constructor for the Sendgrid mailing service.
     * @param {String} apiKey Sendgrid API key. 
     */
    constructor(apiKey) {
        this.sendgrid = SendGrid(apiKey);
    }

    /**
     * Function used for sending an email. 
     * @param {String} from email.
     * @param {String} to email.
     * @param {String} subject of the email.
     * @param {String} body of the email. 
     * @param {String} mimeType of the email body. Specify what you are trying to send: html, plain text or something else. 
     * @returns {Promise} SendGrid API response. 
     */
    async sendEmail(from, to, subject, body, mimeType) {
        const mail = Helpers.prepareEmail(from, to, subject, body, mimeType);
        const request = this.sendgrid.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON(),
        });
        return await this.sendgrid.API(request);
    }
}

module.exports = MailingService;