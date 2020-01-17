const SendGrid = require('sendgrid');
const MailHelper = SendGrid.mail;

/**
 * Used to prepare an email before sending it. 
 * @param {String} from email.
 * @param {String} to email.
 * @param {String} subject of the email.
 * @param {String} body of the email. 
 * @param {String} mimeType of the email body. Specify what you are trying to send: html, plain text or something else. 
 * @returns {Mail} SendGrid mail object.
 */
function prepareEmail(from, to, subject, body, mimeType) {
    const fromEmail = new MailHelper.Email(from); 
    const toEmail = new MailHelper.Email(to);  
    const emailContent = new MailHelper.Content(mimeType, body);  
    return new MailHelper.Mail(fromEmail, subject, toEmail, emailContent);
}

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
     * @returns SendGrid API response wrapped in a promise. 
     */
    async sendEmail(from, to, subject, body, mimeType) {
        const mail = prepareEmail(from, to, subject, body, mimeType);
        const request = this.sendgrid.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON(),
        });
        return await this.sendgrid.API(request);
    }
}

module.exports = MailingService;