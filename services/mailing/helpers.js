const MailHelper = require('sendgrid').mail;

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

module.exports = {
    prepareEmail
};