const postmark = require('postmark');
require('env2')('.config.env');

const client = new postmark.Client(process.env.POSTMARK_API);

/**
 * Send emails to an array of email addresses
 * @param  {Array} to     Array of objects containing names and emails of each recipient (keys name and email)
 * @param  {Object} from  User name and email address (keys name and email)
 */
const mailOut = (to, from) => {
  return new Promise((resolve, reject) => {
    const emails = to.map(address => ({
      From: 'activist@activistarmy.co.uk',
      To: address.email,
      ReplyTo: from.email,
      TemplateId: 1962301,
      TemplateModel: {
        candidatename: address.name,
        sendername: from.name,
      },
    }));
    console.log(emails);

    client.sendEmailBatch(emails, err => {
      if (err) reject(err);

      resolve('Emails successfully sent');
    });
  });
};

module.exports = mailOut;
