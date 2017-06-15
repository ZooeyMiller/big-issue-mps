const postmark = require('postmark');
require('env2')('.config.env');

const client = new postmark.Client(process.env.POSTMARK_API);

/**
 * Send emails to an array of email addresses
 * @param  {Object} to        Recipient name and email (keys name and email)
 * @param  {Object} from      User name and email address (keys name and email)
 * @param  {String} userInput String with custom message from user
 */
const sendMail = (to, from, userInput) => {
  return new Promise((resolve, reject) => {
    const email = {
      From: 'activist@activistarmy.co.uk',
      To: to.email,
      ReplyTo: from.email,
      TemplateId: 1962301,
      TemplateModel: {
        candidatename: to.name,
        sendername: from.name,
        usermessage: userInput,
      },
    };

    client.sendEmailWithTemplate(email, (err, res) => {
      if (err) return reject(err);
      if (res.ErrorCode) {
        console.log(`Email failed to send. Error code ${res.ErrorCode}`);
        return reject({ error: res });
      }
      return resolve({ success: 'Email successfully sent' });
    });
  });
};

/**
 * Send a verification email containing a link with querystrings of UUID and ID
 * @param  {String} To   User email
 * @param  {String} uuid Unique identifier
 * @param  {Number} id   Database ID
 * @return {Promise}
 */
const sendVerificationMail = (To, uuid, id) => {
  return new Promise((resolve, reject) => {
    const email = {
      From: 'activist@activistarmy.co.uk',
      To,
      TemplateId: 2149661,
      TemplateModel: {
        uuid,
        id,
      },
    };

    client.sendEmailWithTemplate(email, (err, res) => {
      if (err) return reject(err);
      if (res.ErrorCode) {
        console.log(`Verification send failed. Error code ${res.ErrorCode}`);
        return reject({ error: res });
      }
      resolve(res);
    });
  });
};

module.exports = { sendMail, sendVerificationMail };
