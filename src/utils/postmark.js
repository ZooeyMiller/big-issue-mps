const postmark = require('postmark');
require('env2')('.config.env');

const client = new postmark.Client(process.env.POSTMARK_API);

/**
 * Send emails to an array of email addresses
 * @param  {Array} to     Array of objects containing names and emails of each recipient (keys name and email)
 * @param  {Object} from  User name and email address (keys name and email)
 */
const mailOut = (to, from, userInput) => {
  return new Promise((resolve, reject) => {
    const emails = to.map(address => ({
      From: 'activist@activistarmy.co.uk',
      To: address.email,
      ReplyTo: from.email,
      TemplateId: 1962301,
      TemplateModel: {
        candidatename: address.name,
        sendername: from.name,
        usermessage: userInput,
      },
    }));

    client.sendEmailBatch(emails, (err, res) => {
      if (err) return reject(err);
      console.log('res is ---', res);
      if (res.findIndex(sent => sent.ErrorCode) !== -1) {
        return reject({ error: res });
      }
      return resolve({ success: 'Emails successfully sent' });
    });
  });
};

module.exports = mailOut;
