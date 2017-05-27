const postmark = require('../utils/postmark');

module.exports = {
  method: 'POST',
  path: '/api',
  handler: (req, reply) => {
    const { emails, fromEmail, subject, body } = JSON.parse(req.payload);
    postmark(emails, fromEmail, subject, body)
      .then(res => {
        reply({ res });
      })
      .catch(reply);
  },
};
