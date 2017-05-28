const postmark = require('../utils/postmark');

module.exports = {
  method: 'POST',
  path: '/api',
  handler: (req, reply) => {
    const { emails, fromEmail } = JSON.parse(req.payload);
    postmark(emails, fromEmail)
      .then(res => {
        reply({ res });
      })
      .catch(err => {
        console.log(err);
        return reply(err);
      });
  },
};
