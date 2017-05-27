const postmark = require('postmark');
require('env2')('.config.env');

const client = new postmark.Client(process.env.POSTMARK_API);

/**
 * Send emails to an array of email addresses
 * @param  {Array} to      Array of string emails
 * @param  {String} from    User's email address
 * @param  {String} subject Subject line
 * @param  {String} body    Body TextBody
 */
const mailOut = (to, from, subject, body) => {
  const emails = to.map(address => ({
    From: 'activist@activistarmy.co.uk',
    To: address,
    ReplyTo: from,
    Subject: subject,
    TextBody: body,
  }));
  console.log(emails);

  client.sendEmailBatch(emails, err => {
    if (err) return console.log(err);

    console.log(`Sent mail`);
  });
};

module.exports = mailOut;
